// TODO
type onError = () => void;
// TODO
type onReady = () => void;
type onProductClick = (product: Product) => void;
// TODO
type onFilter = (filter: Filter) => void;
type onChangeScene = (newScene: { products: Product[] }) => void;
type onLoadScene = (initialScene: { products: Product[] }) => void;
type onChangeProduct = (productChange: { prevProduct: Product; nextProduct: Product }) => void;
type onChangeSelectedProductLocation = (location?: { currentProduct: Product }) => void;

export enum Language {
  FR_FR = 'fr-FR',
  EN_US = 'en-US',
}

export enum initialProductsMode {
  RANDOM = 'random',
  DEFAULT = 'default',
}

type Product = {
  id: string;
  code: string;
  nfiniteCode: string;
};

type Filter = any;

type DisplayBaseProps = {
  token: string;
  productcode?: string;
  config?: any;
  oembedUrl?: string;
  responsive?: boolean;
  onError?: onError;
  onProductClick?: onProductClick;
  onReady?: onReady;
  onFilter?: onFilter;
  onChangeScene?: onChangeScene;
  onLoadScene?: onLoadScene;
  onChangeProduct?: onChangeProduct;
  onChangeSelectedProductLocation?: onChangeSelectedProductLocation;
  language?: Language;
  initialProductsMode: initialProductsMode;
  initialProducts: string[]
};

export type DisplayIdProps = {
  displayid: string;
} & DisplayBaseProps;

export type DisplayUrlProps = {
  displayurl: string;
} & DisplayBaseProps;

export default function Display(props: DisplayIdProps);
export default function Display(props: DisplayUrlProps);
