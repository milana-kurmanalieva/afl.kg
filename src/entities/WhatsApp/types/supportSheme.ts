interface ITechLink {
  url?: string
  title?: string
  icon?: string | null
}

export interface initialSupportState {
  techLink?: ITechLink | null
  techLinkStatus?: string
  techLinkError?: null
}
