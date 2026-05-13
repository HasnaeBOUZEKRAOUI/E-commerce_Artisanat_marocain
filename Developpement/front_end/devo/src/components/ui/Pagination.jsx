/**
 * Pagination
 * @param {number} currentPage
 * @param {number} lastPage
 * @param {func}   onPageChange  - (page) => void
 */
export default function Pagination({ currentPage, lastPage, onPageChange }) {
    if (!lastPage || lastPage <= 1) return null;
  
    const pages = buildPageNumbers(currentPage, lastPage);
  
    return (
      <div className="flex items-center justify-center gap-1 mt-12">
        {/* Précédent */}
        <PageBtn
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Page précédente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </PageBtn>
  
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PageBtn>
          )
        )}
  
        {/* Suivant */}
        <PageBtn
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Page suivante"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </PageBtn>
      </div>
    );
  }
  
  /* ── Bouton page ── */
  function PageBtn({ children, active, disabled, onClick, ...rest }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        {...rest}
        className={`w-8 h-8 flex items-center justify-center rounded text-xs font-semibold transition-all
          ${active
            ? "bg-amber-500 text-white shadow"
            : disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
          }`}
      >
        {children}
      </button>
    );
  }
  
  /* ── Helper : génère [1, 2, …, 5, 6, 7, …, 17] ── */
  function buildPageNumbers(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  
    const pages = [];
    const delta = 2;
  
    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  }