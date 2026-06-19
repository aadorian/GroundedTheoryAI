import { Header } from '../components/layout/Header';
import { CodesCrud, CategoriesCrud } from '../components/crud/CodeBookCrud';

export function CodeBook() {
  return (
    <>
      <Header title="CodeBook" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <CodesCrud />
        <CategoriesCrud />
      </div>
    </>
  );
}
