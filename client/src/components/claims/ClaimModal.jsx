import React, { useState } from 'react';
import { X, Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ClaimModal = ({ item, isOpen, onClose, onClaimSubmitted }) => {
  const [proofOfOwnership, setProofOfOwnership] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofOfOwnership.trim()) {
      setError('Please provide proof or identifying details of your ownership.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('itemId', item._id);
      formData.append('proofOfOwnership', proofOfOwnership);
      if (additionalDescription) {
        formData.append('additionalDescription', additionalDescription);
      }
      if (file) {
        formData.append('supportingImage', file);
      }

      const res = await api.post('/claims', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        onClaimSubmitted(res.data.data);
        onClose();
      }
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError(
        err.response?.data?.message || 'Failed to submit claim. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Ownership Claim
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Claim "{item.title}"
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Please provide verifiable details proving this item belongs to you.
          Campus administrators will cross-verify your claim.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proof of Ownership <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={proofOfOwnership}
              onChange={(e) => setProofOfOwnership(e.target.value)}
              placeholder="e.g. Serial number, wallpaper photo, unique stickers/scratches, lock screen pattern, or receipt details..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Circumstantial Details (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
              placeholder="e.g. Approximate time when lost, location where you might have left it..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supporting Photo or Receipt (Optional)
            </label>
            <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {filePreview ? (
                <div className="flex items-center space-x-3 justify-center">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-md border border-slate-200"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-600">
                    Upload purchase receipt, photo of item, or ID
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG or WEBP up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              {loading ? (
                <span>Submitting Claim...</span>
              ) : (
                <span>Submit Verification Claim</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal;

