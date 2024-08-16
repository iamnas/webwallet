import {
  Keypair,
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

import bs58 from "bs58";

import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";

import { BIP32Interface } from "bip32";

const bip32 = BIP32Factory(ecc);

import { generateMnemonic } from "bip39";

export function deriveSolanaKeypair(seed: Buffer, derivationPath: string) {
  const secret = deriveSolanaPrivateKey(seed, derivationPath);
  return Keypair.fromSecretKey(secret);
}

export function deriveSolanaPrivateKey(seed: Buffer, derivationPath: string) {
  let derivedSeed;
  if (derivationPath.startsWith("501'")) {
    // Sollet deprecated path
    const node: BIP32Interface = bip32.fromSeed(seed);
    derivedSeed = node.derivePath(derivationPath).privateKey;
  } else {
    derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
  }
  return nacl.sign.keyPair.fromSeed(derivedSeed!).secretKey;
}

export function getSolanaKeypair(privateKey: string) {
  let keypair = null;
  try {
    // Attempt to create a keypair from JSON secret key
    keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)));
  } catch {
    // Try the next method
    try {
      // Attempt to create a keypair from bs58 decode of secret key
      keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)));
    } catch {
      // Try the next method
      try {
        // Attempt to create a keypair from hex decode of secret key
        keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
      } catch {
        // Failure, no other ways to interpret
        throw new Error("Invalid Solana private key");
      }
    }
  }

  return keypair;
}

export function getSolanaWallet(secretKey: Uint8Array) {
  let keypair: Keypair;

  try {
    // Directly use the Uint8Array to create a keypair
    keypair = Keypair.fromSecretKey(secretKey);
  } catch {
    throw new Error("Invalid Solana private key");
  }

  const publicKey = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey);

  return { publicKey, privateKey };
}

export function createMnemonic() {
  const mnemonic = generateMnemonic();
  return mnemonic;
}

export function getSolanaWalletAddress(
  seedBuffer: Buffer,
  numderOfAddress: number
) {
  const address = [];
  for (let i = 0; i < numderOfAddress; i++) {
    const keypair = deriveSolanaKeypair(seedBuffer, `m/44'/501'/${i}'/0'`);
    const secretKey = keypair.secretKey;
    address.push(getSolanaWallet(secretKey));
  }

  return address;
}

export async function getSolBalance(address: string) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const wallet = new PublicKey(address);
  return (await connection.getBalance(wallet)) / LAMPORTS_PER_SOL;
}

export async function sendTransaction(pk: string, to: string, amount: number) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const secret = bs58.decode(pk);
    const from = Keypair.fromSecretKey(new Uint8Array(secret));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(to),
        lamports: LAMPORTS_PER_SOL * amount,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    return signature;
  } catch (error) {
    console.log(error);
    return error;
  }
}
