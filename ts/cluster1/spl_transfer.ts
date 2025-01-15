import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../dev-wallet.json"
import { getAccount, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, transfer, transferChecked } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("EfmWyCXGd5LfkXwEUHNPXDzz5X5c5fuzT4padvA544eB");

// Recipient address
const to = new PublicKey("8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        let fromAta;

        const fromAtaAddress = getAssociatedTokenAddressSync(mint, keypair.publicKey);

        const doesFromAtaExist = await connection.getAccountInfo(fromAtaAddress);

        if (!doesFromAtaExist) {
            fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        } else {
            fromAta = getAccount(connection, fromAtaAddress);
        }

        // Get the token account of the toWallet address, and if it does not exist, create it

        let toAta;

        const toAtaAddress = getAssociatedTokenAddressSync(mint, to);

        const doesToAtaExist = await connection.getAccountInfo(toAtaAddress);

        if (!doesToAtaExist) {
            toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        } else {
            toAta = getAccount(connection, toAtaAddress);
        }

        // Transfer the new token to the "toTokenAccount" we just created

        const sig = await transferChecked(connection, keypair, fromAtaAddress, mint, toAtaAddress, keypair, 1, 9);

        console.log(`Your transfer signature is: ${sig}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();