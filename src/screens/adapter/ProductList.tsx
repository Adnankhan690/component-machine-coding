import { useEffect, useState } from "react";
import { useProductAdapter } from "./adapter-provider";

const ProductList = () => {
	const { getProductList } = useProductAdapter();
	const [products, setProducts] = useState<any[]>([]);

	async function fetchProducts() {
		const products = await getProductList();
		console.log(products);
		setProducts(products);
	}

	useEffect(() => {
		fetchProducts();
	}, []);


	return <div>
        {JSON.stringify(products)}
    </div>;
};

export default ProductList;