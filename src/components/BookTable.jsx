import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBook } from '../api/booksApi';
import { toast } from 'react-toastify';

export default function BookTable({ books, onEdit }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted!');
    },
    onError: () => {
      toast.error('Failed to delete book');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
      <table className="w-full text-sm text-left text-gray-800">
        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
          <tr>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Author</th>
            <th className="px-6 py-3">Genre</th>
            <th className="px-6 py-3">Year</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              className="border-t hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 font-medium">{book.title}</td>
              <td className="px-6 py-4">{book.author}</td>
              <td className="px-6 py-4">{book.genre}</td>
              <td className="px-6 py-4">{book.year}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {book.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(book)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
