// TODO
type onError = () => any;
// TODO
type onReady = () => any;
type onProductClick = (product: Product) => void;
// TODO
type onFilter = (filter: Filter) => void;
type onChangeScene = (scene: { products: Product[] }) => void;
type onChangeProduct = (productChange: { prevProduct: Product; nextProduct: Product }) => void;

export enum Language {
  FR_FR = 'fr-FR',
  EN_US = 'en-US',
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
  onChangeProduct?: onChangeProduct;
  language?: Language;
};

export type DisplayIdProps = {
  displayid: string;
} & DisplayBaseProps;

export type DisplayUrlProps = {
  displayurl: string;
} & DisplayBaseProps;

export default function Display(props: DisplayIdProps);
export default function Display(props: DisplayUrlProps);
