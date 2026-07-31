import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_PAGE_SIZE = 5;

export interface ALBUM {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export default function usePaginationV1() {
    const [data, setData] = useState<unknown[]>([]);
    // const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://jsonplaceholder.typicode.com/photos');
            const rs = await response.json();
            setData(rs.slice(0, 15));
        }

        fetchData();
    }, [])

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = (currentPage) * pageSize;

    const totalPages = Math.ceil(data.length / pageSize);

    const paginatedData = data.slice(startIndex, endIndex);

    const hasNext = currentPage === totalPages;
    const hasPrev = currentPage === 1;

    const handleNext = () => {
        // setCurrentPage((prev) => {
        //     if (prev === totalPages) return prev;
        //     return prev + 1
        // });

        if (hasNext) return currentPage;
        setSearchParams(new URLSearchParams({ page: String(currentPage + 1) }))
    }

    const handlePrev = () => {
        // setCurrentPage((prev) => {
        //     if (prev === 1) return prev;
        //     return prev - 1;
        // });
        if (hasPrev) return currentPage;
        setSearchParams(new URLSearchParams({ page: String(currentPage - 1) }))
    }

    const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setPageSize(val);
        setSearchParams(new URLSearchParams({ page: '1' }))
    }

    useEffect(() => {
        setSearchParams(new URLSearchParams({ page: '1' }))
    }, [])

    return {
        data: paginatedData,
        handleNext,
        handlePrev,
        currentPage,
        totalPages,
        handlePageSize,
        hasPrev,
        hasNext,
    }
}