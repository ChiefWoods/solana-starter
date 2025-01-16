import wallet from "../dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "./generug.png";
        const metadata = {
            name: "Generug",
            symbol: "GENE",
            description: "Generug is a generative art project that creates unique rugs.",
            image: "https://arweave.net/DHHYzsbczYVhJkM93qr8L8NPdLYwjYDWqVDaECJxtnbD",
            attributes: [
                {trait_type: 'trait1', value: 'value1'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image,
                    },
                ]
            },
            creators: []
        };
        const genericFile = createGenericFile(JSON.stringify(metadata), "generug_metadata.json", { contentType: 'application/json' });
        const [myUri] = await umi.uploader.upload([genericFile])
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
