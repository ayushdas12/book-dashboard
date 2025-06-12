import { useForm } from 'react-hook-form';

export default function BookFormModal({ onSubmit, closeModal, defaultValues }) {
  const { register, handleSubmit } = useForm({
    defaultValues: defaultValues || {
      title: '',
      author: '',
      genre: '',
      year: '',
      status: 'Available'
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {defaultValues ? 'Edit Book' : 'Add Book'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('title', { required: true })}
            placeholder="Title"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            {...register('author', { required: true })}
            placeholder="Author"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            {...register('genre', { required: true })}
            placeholder="Genre"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            {...register('year', {
              required: true,
              min: 1000,
              max: new Date().getFullYear()
            })}
            placeholder="Published Year"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            {...register('status', { required: true })}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
