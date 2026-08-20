import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

// Function to determine which page numbers to display in the pagination component
// This function returns an array of page numbers and ellipsis indicators based on the current page and total pages
function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ] as const;
}

export default function PaginationTemplate({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const t = useTranslations("Common");

  const visiblePages =
    currentPage && totalPages ? getVisiblePages(currentPage, totalPages) : [];

  const [, setPageParam] = useQueryState(
    "page",
    parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("Previous")}
            aria-label={t("Previous")}
            onClick={(event) => {
              event.preventDefault();

              if (currentPage > 1) {
                setPageParam((currentPage - 1).toString());
              }
            }}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {visiblePages.map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                aria-label={`${t("Showing")} ${item}`}
                onClick={(event) => {
                  event.preventDefault();
                  setPageParam(item.toString());
                }}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            text={t("Next")}
            aria-label={t("Next")}
            onClick={(event) => {
              event.preventDefault();

              if (currentPage < totalPages) {
                setPageParam((currentPage + 1).toString());
              }
            }}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
