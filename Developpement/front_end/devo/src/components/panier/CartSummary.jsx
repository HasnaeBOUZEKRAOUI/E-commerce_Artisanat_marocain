export default function CartSummary({ total, note, onNoteChange }) {
  return (
    <div className="w-full lg:w-80 border border-gray-200 rounded p-6 flex flex-col gap-4">
      <label className="text-sm font-semibold text-gray-800">
        Ajouter une note de commande
      </label>
 
      <textarea
        rows={3}
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm resize-y outline-none focus:border-yellow-600 transition-colors"
      />
 
      <div className="flex justify-between items-center text-sm font-semibold py-1">
        <span>Total :</span>
        <span>{total.toFixed(2)}dh</span>
      </div>
 
      <button className="w-full border border-gray-300 rounded py-3 text-sm font-semibold hover:border-yellow-600 hover:text-yellow-700 transition-colors cursor-pointer">
        De nombreux cadeaux à gagner!
      </button>
 
      <button className="w-full bg-black text-white rounded py-3 text-sm font-bold tracking-wide hover:bg-gray-900 transition-colors cursor-pointer">
        vérifier
      </button>
 
      <button className="w-full border border-gray-300 rounded py-3 text-sm font-semibold hover:border-black transition-colors cursor-pointer">
        continuer vos achats
      </button>
    </div>
  );
}