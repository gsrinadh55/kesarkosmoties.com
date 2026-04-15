import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReviewSubmit({ rating, comment, image });
      setRating(0);
      setComment("");
      setImage(null);
      toast.success("Review submitted successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E0D8C8]">
            <h2 className="font-heading text-2xl font-semibold text-[#3E2723]">Write a Review</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#EFE9DF] rounded-full transition-colors">
              <X className="w-6 h-6 text-[#3E2723]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#3E2723]">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-[#D97736] text-[#D97736]"
                          : "text-[#E0D8C8] text-[#3E2723]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#3E2723]">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full p-3 border-2 border-[#E0D8C8] rounded-lg focus:border-[#D97736] focus:outline-none resize-none h-24"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#3E2723]">Add Photo (Optional)</label>
              <div className="border-2 border-dashed border-[#E0D8C8] rounded-lg p-4 text-center cursor-pointer hover:border-[#D97736] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <>
                      <p className="text-[#D97736] font-semibold">Click to upload image</p>
                      <p className="text-xs text-[#5D4037]">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#E0D8C8] bg-[#FAF7F2] flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#E0D8C8] text-[#3E2723] rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#D97736] hover:bg-[#C96626] text-white rounded-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
