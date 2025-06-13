import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBook, getBooks, updateBook } from '../api/booksApi';
import BookTable from '../components/BookTable';
import BookFormModal from '../components/BookFormModal';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);

  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added!');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, book }) => updateBook(id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated!');
    },
  });

  const handleAddClick = () => {
    setEditBook(null);
    setShowModal(true);
  };

  const handleEditClick = (book) => {
    setEditBook(book);
    setShowModal(true);
  };

  const handleSubmit = (formData) => {
    if (editBook) {
      editMutation.mutate({ id: editBook.id, book: formData });
    } else {
      addMutation.mutate(formData);
    }
    setShowModal(false);
  };

  const filteredBooks = (data?.data || []).filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter ? book.genre === genreFilter : true;
    const matchesStatus = statusFilter ? book.status === statusFilter : true;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-sm">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="hidden md:block w-full md:w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-6">MyBooks</h2>
          <nav className="flex flex-col gap-4 text-gray-700 text-sm">
            <button className="text-left hover:text-blue-600">Home</button>
            <button className="text-left hover:text-blue-600">Library</button>
            <button className="text-left hover:text-blue-600">Categories</button>
            <button className="text-left hover:text-blue-600">Settings</button>
          </nav>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-700">Book Dashboard</h1>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              ➕ Add Book
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 shadow-sm w-full sm:w-auto"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Thriller">Thriller</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 shadow-sm w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <div className="min-w-[640px]">
              <BookTable books={paginatedBooks} onEdit={handleEditClick} />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-center mt-6 gap-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * booksPerPage + 1}–
              {Math.min(currentPage * booksPerPage, filteredBooks.length)} of {filteredBooks.length} books
            </p>
          </div>

          {/* Modal */}
          {showModal && (
            <BookFormModal
              onSubmit={handleSubmit}
              closeModal={() => setShowModal(false)}
              defaultValues={editBook}
            />
          )}
        </main>
      </div>
    </div>
  );
}
