import { HDNodeWallet, Wallet } from "ethers";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

export function deriveEthereumWallet(seed: string, derivationPath: string) {
  const privateKey = deriveEthereumPrivateKey(
    mnemonicToSeedSync(seed),
    derivationPath
  );
  return privateKey; //new Wallet(privateKey);
}

export function deriveEthereumPrivateKey(seed: Buffer, derivationPath: string) {
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivationPath);
  return child.privateKey;
}

export function getEthereumWallet(privateKey: string): Wallet {
  let wallet;
  try {
    wallet = new Wallet(privateKey);
  } catch {
    throw new Error("Invalid Ethereum private key");
  }
  return wallet;
}

export function createMnemonic() {
  const mnemonic = generateMnemonic();
  return mnemonic;
}

export function getEthWalletAddress(
  seedBuffer: string,
  numderOfAddress: number
) {
  const address = [];

  for (let i = 0; i < numderOfAddress; i++) {
    const privateKey: string = deriveEthereumWallet(
      seedBuffer,
      `m/44'/60'/${i}'/0'`
    );
    const wallet = new Wallet(privateKey);
    const publicKey = wallet.address;
    address.push({
      publicKey,
      privateKey,
    });
  }

  return address;
}
