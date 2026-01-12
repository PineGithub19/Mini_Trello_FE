import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import useDebounce from "@/hooks/use-debounce";
import { useSearchWorkspaces } from "@/hooks/search-hooks";
import { useNavigate } from "react-router-dom";

const searchSchema = z.object({
  query: z.string().min(0).max(1000),
});

type DashboardSearchFormData = z.infer<typeof searchSchema>;

const DashboardSearch = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<DashboardSearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = () => undefined;

  const queryValue = watch("query") ?? "";
  const debouncedQuery = useDebounce<string>(queryValue, 400);
  const shouldShowResults = debouncedQuery.trim().length > 0;
  const {
    data: searchResults,
    isFetching,
    isError,
    error,
  } = useSearchWorkspaces(shouldShowResults ? debouncedQuery : "");
  const workspaces = searchResults?.data ?? [];

  const handleWorkspaceClick = (id: string) => {
    navigate(`/dashboard/workspaces/${id}`);
  };

  return (
    <div className="relative flex w-full flex-col items-start gap-3 md:max-w-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full min-w-0 items-center gap-2"
      >
        <Input
          type="search"
          placeholder="Search boards, cards, or people"
          className="flex-1"
          {...register("query")}
        />
        <Button type="submit" size="sm" className="shrink-0">
          Search
        </Button>
      </form>
      {shouldShowResults && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-background shadow-sm">
          {isFetching && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Searching workspaces...
            </p>
          )}
          {!isFetching && isError && (
            <p className="px-3 py-2 text-sm text-destructive">
              {error?.message || "Failed to search workspaces"}
            </p>
          )}
          {!isFetching && !isError && workspaces.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No workspaces found.
            </p>
          )}
          {!isFetching && !isError && workspaces.length > 0 && (
            <ul className="divide-y">
              {workspaces.map((workspace) => (
                <li
                  key={workspace.id}
                  className="px-3 py-2 hover:cursor-pointer hover:bg-accent"
                  onClick={() => handleWorkspaceClick(workspace.id)}
                >
                  <p className="text-sm font-medium">{workspace.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created on {new Date(workspace.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSearch;
