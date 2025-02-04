from typing import TypedDict, cast

from algopy import ARC4Contract, UInt64, arc4
from algosdk import account
from algosdk.transaction import (
    AssetConfigTxn,
    AssetTransferTxn,
    SignedTransaction,
    SuggestedParams,
    wait_for_confirmation,
)
from algosdk.v2client import algod

# Algorand client setup
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Asset parameters
ASSET_NAME = "TokenizedAsset"
UNIT_NAME = "TA"
TOTAL_SUPPLY = 1000000  # Uint64
DECIMALS = 2  # Uint64


class TransactionInfo(TypedDict, total=False):
    """TypedDict for transaction info response."""

    asset_index: int
    confirmed_round: int


class AutonomousAsset(ARC4Contract):
    """Class for autonomous asset management."""

    @arc4.abimethod
    def create_asset(self, creator_private_key: str, creator_address: str) -> UInt64:
        """
        Create a new asset.
        """
        params: SuggestedParams = algod_client.suggested_params()
        txn: AssetConfigTxn = AssetConfigTxn(
            sender=creator_address,
            sp=params,
            total=TOTAL_SUPPLY,
            default_frozen=False,
            unit_name=UNIT_NAME,
            asset_name=ASSET_NAME,
            manager=creator_address,
            reserve=creator_address,
            freeze=creator_address,
            clawback=creator_address,
            decimals=DECIMALS,
        )
        signed_txn: SignedTransaction = txn.sign(creator_private_key)
        txid: str = algod_client.send_transaction(signed_txn)
        wait_for_confirmation(algod_client, txid)

        # Handle response typing explicitly
        ptx_response = algod_client.pending_transaction_info(txid)
        if isinstance(ptx_response, bytes):
            raise ValueError("Unexpected bytes response")

        ptx = cast(TransactionInfo, ptx_response)
        if "asset-index" in ptx_response:  # Directly check original response
            return UInt64(int(ptx_response["asset-index"]))
        raise ValueError("Asset index not found in transaction response")

    # Rest of the methods remain the same...
    def opt_in_to_asset(
        self, receiver_private_key: str, receiver_address: str, asset_id: UInt64
    ) -> None:
        """
        Opt-in to an asset.
        """
        params: SuggestedParams = algod_client.suggested_params()
        txn: AssetTransferTxn = AssetTransferTxn(
            sender=receiver_address,
            sp=params,
            receiver=receiver_address,
            amt=0,
            index=asset_id,
        )
        signed_txn: SignedTransaction = txn.sign(receiver_private_key)
        txid: str = algod_client.send_transaction(signed_txn)
        wait_for_confirmation(algod_client, txid)

    def transfer_asset(
        self,
        sender_private_key: str,
        sender_address: str,
        receiver_address: str,
        asset_id: UInt64,
        amount: UInt64,
    ) -> None:
        """
        Transfer an asset.
        """
        params: SuggestedParams = algod_client.suggested_params()
        txn: AssetTransferTxn = AssetTransferTxn(
            sender=sender_address,
            sp=params,
            receiver=receiver_address,
            amt=amount,
            index=asset_id,
        )
        signed_txn: SignedTransaction = txn.sign(sender_private_key)
        txid: str = algod_client.send_transaction(signed_txn)
        wait_for_confirmation(algod_client, txid)


# Autonomous execution
contract = AutonomousAsset()
creator_private_key, creator_address = account.generate_account()
receiver_private_key, receiver_address = account.generate_account()

print(f"Creator Address: {creator_address}")
print(f"Receiver Address: {receiver_address}")

asset_id = contract.create_asset(creator_private_key, creator_address)
contract.opt_in_to_asset(receiver_private_key, receiver_address, asset_id)
contract.transfer_asset(
    creator_private_key, creator_address, receiver_address, asset_id, UInt64(100)
)

print("✅ Asset tokenization and transfer completed autonomously.")
