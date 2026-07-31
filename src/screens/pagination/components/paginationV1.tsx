import "../paginationV1.css";
import { ALBUM } from "../hooks/usePaginationV1";
import usePaginationV1 from "../hooks/usePaginationV1";

export default function PaginationV1() {
    const {
        data,
        handleNext,
        handlePrev,
        currentPage,
        totalPages,
        handlePageSize,
        hasNext,
        hasPrev,
    } = usePaginationV1();

    return (
        <div>
            <div className="control-wrapper">
                <div>
                    <label htmlFor="page">Page: </label>
                    <select id="page" name="page-size" onChange={handlePageSize}>
                        <option value="" disabled selected  >Select value...</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div className="page-controller">
                    <button onClick={handlePrev} disabled={hasPrev}>{'<'}</button>
                    <p className="page-view">page: {currentPage} / {totalPages} </p>
                    <button onClick={handleNext} disabled={hasNext}>{'>'}</button>
                </div>
            </div>
            {data.map(({ title, albumId }: ALBUM) => (
                <div key={albumId}>
                    {title}
                </div>
            ))}
        </div>
    )
}