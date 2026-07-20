// https://dev.to/papercoding22/adapter-pattern-with-react-29bg 
import { createContext, useContext } from "react";

interface AdapterProviderProps {
	children: React.ReactNode;
}

const AdapterContext = createContext({});

const createProductAdapter = (productService) => ({
	getProductList: async () => {
		const products = await productService.getProducts();
		const formattedProducts = products.map(({ id, name, price }) => ({
			id,
			name,
			price,
		}));
		return formattedProducts;
	},
	getProductDetails: async () => {
		const product = await productService.getProductById(productId);
		const { id, name, price, description } = product;
		const formattedProduct = {
			id,
			name,
			price,
			description,
		};
		return formattedProduct;
	},
});

const createProductService = () => ({
    getProductList: async () => {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data;
    },
    getProductById: async () => {
        const response = await fetch('');
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        return data;
    }
})

export const AdapterProvider = ({ children }: AdapterProviderProps) => {
    const productService = createProductService();
    const productAdapter = createProductAdapter(productService);

	return (
		<AdapterContext.Provider value={productAdapter}>
			{children}
		</AdapterContext.Provider>
	);
};


export const useProductAdapter = () => {
    const context = useContext(AdapterContext);
    if (!context) {
        throw new Error('useProductAdapter context must be used within AdapterProvider');
    }
    return context;
}