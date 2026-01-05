import { Button } from "../ui/button";

const PaginationUI = ({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="default"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        variant="default"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationUI;
