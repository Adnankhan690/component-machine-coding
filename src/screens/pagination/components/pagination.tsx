import usePagination from "../hooks/usePagination";

export default function Pagination() {
    const {
        paginatedData,
        currentPage,
        handleNext,
        handlePrev,
        hasNext,
        hasPrev,
        totalPages,
    } = usePagination();

    return (
        <div>
            <div>
                <div>
                    <span>Page : {currentPage} - total pages : {totalPages}</span>
                    <button disabled={!hasPrev} onClick={handlePrev}>{'<'} prev</button>
                    <button disabled={!hasNext} onClick={handleNext}>next {'>'}</button>
                </div>
                {paginatedData.map((item) => {
                    return (
                        <div key={item['id']}>
                            <p>
                                <span>{item['id']} - </span>
                                {item['title']}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}