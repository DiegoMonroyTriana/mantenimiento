'use client'

import { useRef, useState } from 'react'
import { Camera } from 'react-camera-pro'
import { CameraIcon, CloseIcon } from './icons'

export function CameraComponent ({ visible = false, setVisible }: { visible: boolean, setVisible: (value: boolean) => void }) {
  const camera = useRef(null)
  const [numberOfCameras, setNumberOfCameras] = useState(0)
  // const [image, setImage] = useState<string | null>(null)
  const height = window.innerHeight
  const width = window.innerWidth
  const ratio = width / height
  console.log(numberOfCameras)
  // const capture = () => {
  //   const imageSrc = camera?.current?.takePhoto()
  //   rotateImage(imageSrc, 90, (image: string) => {
  //     setImage(image)
  //     localStorage.setItem('myPhoto', image)
  //     // push('/result_photo')
  //   })
  //   setVisible(false)
  // }

  // const rotateImage = (imageBase64: string, rotation: number, cb: (data: string) => void) => {
  //   const img = new Image()
  //   img.src = imageBase64
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas')
  //     canvas.width = img.width
  //     canvas.height = img.height
  //     const ctx = canvas.getContext('2d')
  //     ctx?.translate(canvas.width, 0)
  //     ctx?.scale(-1, 1)
  //     ctx?.drawImage(img, 0, 0)
  //     cb(canvas.toDataURL('image/jpeg'))
  //   }
  // }

  return visible && (
    <section className='absolute inset-0 flex flex-col bg-black'>
      <Camera
        errorMessages={{
          noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
          permissionDenied: 'Permission denied. Please refresh and give camera permission.',
          switchCamera: 'Please switch your camera',
          canvas: 'Canvas is not supported.'
        }}
        ref={camera}
        numberOfCamerasCallback={setNumberOfCameras}
        facingMode="user"
        aspectRatio={ratio}
      />
      <button
        className='bg-black border-2 border-white rounded-full px-5 py-2
         text-white flex flex-row gap-1 justify-center absolute bottom-5 left-1/2 transform -translate-x-1/2 '>
        Capturar
        <CameraIcon className='w-6 h-6'/>
      </button>
      <button className='absolute right-4 top-4 text-white bg-transparent' onClick={() => { setVisible(false) }}>
        <CloseIcon className='w-6 h-6'/>
      </button>
    </section>
  )
}
