import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    MPL_TOKEN_METADATA_PROGRAM_ID
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";

// Define our Mint address
const mint = publicKey("EfmWyCXGd5LfkXwEUHNPXDzz5X5c5fuzT4padvA544eB")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer,
            metadata: publicKey(
                PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("metadata"),
                        new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
                        new PublicKey(mint).toBuffer(),
                    ],
                    new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
                )[0].toBase58()
            ),
        }

        let data: DataV2Args = {
            name: "Turbin3 Mint",
            symbol: "TURBIN3",
            uri: "",
            collection: null,
            creators: null,
            uses: null,
            sellerFeeBasisPoints: 0,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            collectionDetails: null,
            data,
            isMutable: true,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
