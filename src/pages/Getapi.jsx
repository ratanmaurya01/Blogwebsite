import axios from 'axios'
import React, { useState } from 'react'

function Getapi() {

    const [products, setProducts] = useState([]);
    const handleGetData = async () => {
        const ulrs = "https://dummyjson.com/products"
        try {
            const response = await axios.get(ulrs);
            if (response.status === 200) {
                console.log(response.data.products);
                const data = response.data.products
                setProducts(data);
            }
        } catch (erro) {
            console.log('error', erro);
        }
    }


    return (
        <div className='ml-10'>


            <div>
                <button onClick={handleGetData}>Get Data </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 shadow-md">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="p-4 border rounded shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-lg font-bold">{index} : {product.title}</h2>
                        <p className="text-gray-700 mt-2">{product.tags}</p>
                        <p className="text-gray-700 mt-2">{product.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
                        <p className="text-sm text-gray-500 mt-1">Price: ${product.price}</p>

                        <img
                            src={product.images[0]} // Access the first image from the images array
                            alt={product.title}
                            className="w-100 h-60 object-cover rounded-sm" // Add width, height, and styling
                        />

                        <div className='flex justify-around'>
                            <div className=' rounded-md text-white shadow-md'>

                                <button data-tooltip-target="favourites-tooltip-1" type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                                    <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"></path>
                                    </svg>
                                </button>

                            </div>
                            <div className=' rounded-md text-white shadow-md'>

                                <button type="button" className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium  text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                                    </svg>
                                    Add to cart
                                </button>

                            </div>

                        </div>
                    </div>


                ))}
            </div>

        </div>
    )
}

export default Getapi
