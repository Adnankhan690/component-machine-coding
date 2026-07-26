import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 900;

//THIS CODE USES 2 WAY OF PAGINATION 
//1. URL WAY [ACTIVE] 
//2. HOOK WAY [INACTIVE] 
//comment the URL way and un-comment the hook way to check hook way.

export default function usePagination() {
    const [data, setData] = useState<unknown[]>([]);
    //hook-way
    // const [currentPage, setCurrentPage] = useState(1);

    //url-way
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        // using promises
        // fetch('https://jsonplaceholder.typicode.com/photos').then((res) => {
        //     return res.json();
        // }).then((data) => {
        //     setData(data);
        // })

        // using async await
        const fetchData = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/photos');
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, [])

    //comment this if you dont want url way of pagination
    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams(new URLSearchParams({ page: '1' }))
        }
    }, [searchParams, setSearchParams])

    const paginatedData = data.slice((currentPage - 1) * PAGE_SIZE, (currentPage) * PAGE_SIZE).map((item) => {
        return item;
    })

    const handleNext = () => {
        //hook-way
        // setCurrentPage((prev) => prev + 1)

        //url-way
        setSearchParams(new URLSearchParams({ page: (currentPage + 1).toString() }))
    }

    const handlePrev = () => {
        //hook-way
        // setCurrentPage((prev) => prev - 1)

        //url-way
        setSearchParams(new URLSearchParams({ page: (currentPage - 1).toString() }))
    }

    const hasNext = currentPage * PAGE_SIZE < data.length;
    const hasPrev = currentPage > 1;
    const totalPages = Math.ceil(data.length / PAGE_SIZE);

    return {
        paginatedData,
        currentPage,
        handleNext,
        handlePrev,
        hasNext,
        hasPrev,
        totalPages,
    }
}