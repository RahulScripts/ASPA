from algopy import *
from algopy.arc4 import abimethod


class aspa(ARC4Contract):
    # Asset-related state
    asset_details: dict[
        UInt64, Bytes
    ]  # Maps asset ID to its details (e.g., name, description)
    asset_quantities: dict[UInt64, UInt64]  # Maps asset ID to its available quantity
    asset_prices: dict[UInt64, UInt64]  # Maps asset ID to its price per unit
    asset_sellers: dict[UInt64, Bytes]  # Maps asset ID to the seller's address

    # CREATE ASSET (Seller)
    @abimethod()
    def create_asset(
        self,
        asset_details: Bytes,
        quantity: UInt64,
        price: UInt64,
        mbrpay: gtxn.PaymentTransaction,
    ) -> UInt64:
        """
        Seller creates and lists an asset with a specific quantity and price.
        """
        # Ensure the seller pays the minimum balance requirement (MBR) for asset creation
        assert mbrpay.receiver == Global.current_application_address
        assert mbrpay.amount == Global.min_balance + Global.asset_opt_in_min_balance

        # Create a new Algorand Standard Asset (ASA)
        asset_id = (
            itxn.AssetConfig(
                total=quantity,  # Total supply of the asset
                decimals=0,  # No fractional ownership (whole units only)
                unit_name="ASSET",
                asset_name="Tokenized Asset",
                manager=Global.current_application_address,
                reserve=Global.current_application_address,
                freeze=Global.current_application_address,
                clawback=Global.current_application_address,
                fee=1_000,
            )
            .submit()
            .created_asset.id
        )

        # Store asset details, quantity, price, and seller address
        self.asset_details[asset_id] = asset_details
        self.asset_quantities[asset_id] = quantity
        self.asset_prices[asset_id] = price
        self.asset_sellers[asset_id] = Txn.sender.bytes

        return asset_id

    # TRANSACTION (Buyer)
    @abimethod()
    def buy_asset(
        self, asset_id: UInt64, quantity: UInt64, buyerTxn: gtxn.PaymentTransaction
    ) -> None:
        """
        Buyer purchases an asset at the listed price.
        """
        # Ensure the asset has sufficient quantity
        assert (
            self.asset_quantities[asset_id] >= quantity
        ), "Insufficient quantity available"

        # Ensure the buyer pays the correct amount
        total_price = self.asset_prices[asset_id] * quantity
        assert buyerTxn.sender == Txn.sender, "Buyer must be the transaction sender"
        assert (
            buyerTxn.receiver == Global.current_application_address
        ), "Payment must be sent to the app"
        assert buyerTxn.amount == total_price, "Incorrect payment amount"

        # Transfer the asset to the buyer
        itxn.AssetTransfer(
            xfer_asset=asset_id,
            asset_receiver=Txn.sender,
            asset_amount=quantity,
            fee=1_000,
        ).submit()

        # Update the remaining quantity of the asset
        self.asset_quantities[asset_id] = self.asset_quantities[asset_id] - quantity

        # If the asset is sold out, remove it from the marketplace
        if self.asset_quantities[asset_id] == 0:
            del self.asset_details[asset_id]
            del self.asset_quantities[asset_id]
            del self.asset_prices[asset_id]
            del self.asset_sellers[asset_id]
