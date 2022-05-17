// TODO
type onError = () => any;
// TODO
type onReady = () => any;
type onProductClick = (product: Product) => void;
// TODO
type onFilter = (filter: Filter) => void;
type onChangeScene = (scene: { products: Product[] }) => void;
type onChangeProduct = (productChange: {prevProduct: Product, nextProduct: Product }) => void;

export enum Language {
  'fr-FR' = 'fr-FR',
  'en-US' ='en-US'
}

type Product = {
  id:  String,
  code: String,
  nfiniteCode: String
}

type Filter = any

type DisplayBaseProps = {
  token: String,
  productcode?: String,
  config?: any,
  oembedUrl?: String,
  responsive?: Boolean,
  onError?: onError,
  onProductClick?: onProductClick,
  onReady?: onReady,
  onFilter?: onFilter,
  onChangeScene?: onChangeScene,
  onChangeProduct?: onChangeProduct,
  language?: Language,
}

export type DisplayIdProps = {
  displayid: String;
} & DisplayBaseProps

export type DisplayUrlProps = {
  displayurl: String;
} & DisplayBaseProps

export default function Display(props: DisplayIdProps);
export default function Display(props: DisplayUrlProps);
