export const DERIVATION_PATHS = {
  SOLANA: (index: number) => `m/44'/501'/${index}'/0'`,
  ETHEREUM: (index: number) => `m/44'/60'/${index}'/0'`
} as const;

export const NETWORKS = {
  SOLANA: {
    DEVNET: 'devnet',
    MAINNET: 'mainnet-beta'
  }
} as const;