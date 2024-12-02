export interface AnyContact {
  [name: string]: string;
}

export interface FooterInfo {
  phone_numbers: AnyContact[],
  addresses: AnyContact[],
  medias: AnyContact[]
}
