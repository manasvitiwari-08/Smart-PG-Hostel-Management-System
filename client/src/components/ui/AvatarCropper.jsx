import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUpload, FiCheck, FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi'

// Helper: convert crop area to a canvas blob
async function getCroppedBlob(imageSrc, croppedAreaPixels) {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob())
  const canvas = document.createElement('canvas')
  const size = 256
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0, 0, size, size
  )
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
}

export default function AvatarCropper({ currentAvatar, userName, onSave, saving }) {
  const [step, setStep] = useState('idle') // idle | crop | preview
  const [rawSrc, setRawSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setRawSrc(reader.result); setStep('crop') }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropDone = async () => {
    const blob = await getCroppedBlob(rawSrc, croppedAreaPixels)
    setPreviewUrl(URL.createObjectURL(blob))
    setStep('preview')
  }

  const handleConfirm = async () => {
    const blob = await getCroppedBlob(rawSrc, croppedAreaPixels)
    // Convert to base64 for storage (or pass blob for Cloudinary upload)
    const reader = new FileReader()
    reader.onload = () => onSave(reader.result)
    reader.readAsDataURL(blob)
  }

  const handleCancel = () => {
    setStep('idle')
    setRawSrc(null)
    setPreviewUrl(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  const displayAvatar = previewUrl || currentAvatar

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar display */}
      <div className="relative group">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
          {displayAvatar
            ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
            : <span>{userName?.charAt(0)?.toUpperCase()}</span>
          }
        </div>
        {/* Upload overlay */}
        <label className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
          <FiUpload size={20} className="text-white" />
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      <p className="text-xs text-slate-500">Click avatar to change photo</p>

      {/* Crop Modal */}
      <AnimatePresence>
        {(step === 'crop' || step === 'preview') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md glass-dark rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">
                  {step === 'crop' ? 'Crop Your Photo' : 'Preview'}
                </h3>
                <button onClick={handleCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  <FiX size={16} />
                </button>
              </div>

              {step === 'crop' && (
                <>
                  {/* Crop area */}
                  <div className="relative w-full h-72 bg-slate-900">
                    <Cropper
                      image={rawSrc}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  {/* Controls */}
                  <div className="px-5 py-4 space-y-3">
                    {/* Zoom */}
                    <div className="flex items-center gap-3">
                      <FiZoomOut size={14} className="text-slate-400 flex-shrink-0" />
                      <input
                        type="range" min={1} max={3} step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 accent-indigo-500 h-1.5 rounded-full cursor-pointer"
                      />
                      <FiZoomIn size={14} className="text-slate-400 flex-shrink-0" />
                    </div>
                    {/* Rotation */}
                    <div className="flex items-center gap-3">
                      <FiRotateCw size={14} className="text-slate-400 flex-shrink-0" />
                      <input
                        type="range" min={0} max={360} step={1}
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="flex-1 accent-purple-500 h-1.5 rounded-full cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 w-8">{rotation}°</span>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button onClick={handleCancel} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleCropDone} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 'preview' && (
                <div className="px-5 py-6 flex flex-col items-center gap-5">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/40 shadow-xl shadow-indigo-500/20">
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-slate-400 text-sm">Looks good? Save this as your avatar.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setStep('crop')} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition-colors">
                      ← Re-crop
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={saving}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FiCheck size={15} />
                      {saving ? 'Saving...' : 'Save Avatar'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
  