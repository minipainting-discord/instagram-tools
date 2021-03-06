import React from "react"
import ReactCrop from "react-image-crop"
import throttle from "lodash/throttle"

import config from "./ImageBuilder.config.js"

import OVERLAYS from "./overlays"

import { Icon } from "./ui"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  ImageBuilder: styled.div(styles.screen),
  Cropper: styled.div(styles.cropper),
  Uploader: styled.div(styles.uploader),
  Picker: styled.div(styles.picker),
  Radio: styled.div(styles.radio),
  Split: styled.div(styles.split),
  Outputs: styled.div(styles.outputs),
  Output: styled.a(styles.output),
}))

const POST_TYPE = config

const PAINT_ALONG_POST_TYPES = Object.values(POST_TYPE).filter(
  type => type.family === "paint-along",
)

class ImageBuilder extends React.Component {
  state = {
    step: 0,
    postType: Object.keys(POST_TYPE).shift(),
    uploads: [],
    images: [],
    crops: [],
    canvases: [],
  }

  onSetStep = step => () =>
    this.setState({ step }, () => this.topRef.current.scrollIntoView())

  onChangeType = ev => {
    this.setState({ postType: ev.currentTarget.value })
  }

  onChooseFiles = ev => {
    const postType = POST_TYPE[this.state.postType]
    const files = [].slice.call(ev.currentTarget.files, 0, postType.required)

    this.setState({ uploads: files }, () => {
      Promise.all(
        files.map(
          file =>
            new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve({ file, dataURL: reader.result })
              }
              reader.readAsDataURL(file)
            }),
        ),
      )
        .then(async images => {
          const loadedImages = await Promise.all(
            images.map(i => loadImage(i.dataURL)),
          )
          loadedImages.forEach((image, index) => {
            image.file = images[index].file
          })

          return loadedImages
        })
        .then(images => {
          this.setState({
            images,
            crops: images.map(image => ({ aspect: 1 / 1 })),
            canvases: Array.from({ length: postType.outputs }, () =>
              React.createRef(),
            ),
          })
        })
    })
  }

  onUpdateCrop = index => crop => {
    this.setState(prevState => {
      const newCrops = prevState.crops.slice()
      newCrops[index] = crop
      return { crops: newCrops }
    })
  }

  topRef = React.createRef()

  async componentDidUpdate() {
    if (this.state.step < 2) {
      return
    }

    this.redraw()
  }

  redraw = throttle(async () => {
    const { postType: postTypeKey, images, crops, canvases } = this.state
    const postType = POST_TYPE[postTypeKey]

    if (postType === POST_TYPE.SOLO) {
      await drawSoloImages(images, crops, canvases)
    } else if (postType === POST_TYPE.CHALLENGE_BEFORE_AFTER) {
      await drawChallengeBeforeAfter(images, crops, canvases)
    } else if (PAINT_ALONG_POST_TYPES.includes(postType)) {
      await drawPaintAlongImages(postType, images, crops, canvases)
    }
  }, 100)

  render() {
    const { step, postType, uploads, images, crops, canvases } = this.state

    return (
      <T.ImageBuilder ref={this.topRef}>
        {[
          () => (
            <PostTypeStep
              postType={postType}
              onChangeType={this.onChangeType}
              onNextStep={this.onSetStep(1)}
            />
          ),
          () => (
            <UploadStep
              postType={POST_TYPE[postType]}
              uploads={uploads}
              onChooseFiles={this.onChooseFiles}
              onNextStep={this.onSetStep(2)}
            />
          ),
          () => (
            <CropStep
              postType={POST_TYPE[postType]}
              images={images}
              crops={crops}
              canvases={canvases}
              onUpdateCrop={this.onUpdateCrop}
            />
          ),
        ][step]()}
      </T.ImageBuilder>
    )
  }
}

function PostTypeStep({ postType, onChangeType, onNextStep }) {
  return (
    <form>
      <T.Picker>
        <h2>Choose album type</h2>
        {Object.keys(POST_TYPE).map(key => (
          <T.Radio key={key}>
            <input
              type="radio"
              name="post-type"
              onChange={onChangeType}
              value={key}
              checked={postType === key}
              disabled={POST_TYPE[key].disabled}
              id={`post-type-${key}`}
            />
            <label htmlFor={`post-type-${key}`}>{POST_TYPE[key].name}</label>
          </T.Radio>
        ))}
        <button onClick={onNextStep}>
          NEXT <Icon name="chevron-right" />
        </button>
      </T.Picker>
    </form>
  )
}

function UploadStep({ postType, uploads, onChooseFiles, onNextStep }) {
  return (
    <T.Uploader>
      <h2>Select {postType.required} images</h2>
      <label htmlFor="picture">
        <Icon name="image-inverted" />
        Choose picture{postType.required === 1 ? "" : "s"}
      </label>
      <input
        type="file"
        id="picture"
        onChange={onChooseFiles}
        multiple={postType.required !== 1}
      />
      <ul>
        {uploads.map(file => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <button
        onClick={onNextStep}
        disabled={uploads.length < postType.required}
      >
        NEXT <Icon name="chevron-right" />
      </button>
    </T.Uploader>
  )
}

function CropStep({ postType, images, canvases, crops, onUpdateCrop }) {
  const now = +new Date()

  const onDownload = ref => ev => {
    const canvas = ref.current
    const dataURL = canvas.toDataURL("image/jpeg")
    ev.currentTarget.setAttribute("href", dataURL)
  }

  return (
    <T.Split>
      <T.Cropper>
        {images.map((image, index) => {
          const w = "614px"
          const h = image.height + "px"
          return (
            <React.Fragment key={image.file.name}>
              <h3>{image.file.name}</h3>
              <ReactCrop
                style={{
                  minWidth: w,
                  minHeight: h,
                  maxWidth: w,
                  maxHeight: h,
                  width: w,
                  height: h,
                }}
                src={image.src}
                crop={crops[index]}
                onChange={onUpdateCrop(index)}
              />
            </React.Fragment>
          )
        })}
      </T.Cropper>
      <T.Outputs>
        {canvases.map((ref, index) => (
          <T.Output
            key={index}
            href={`#output-canvas-${index}`}
            onClick={onDownload(ref)}
            download={`minipainting-${now}-${index}.jpeg`}
          >
            <canvas
              id={`output-canvas-${index}`}
              ref={ref}
              width="614"
              height="614"
            />
          </T.Output>
        ))}
      </T.Outputs>
    </T.Split>
  )
}

function loadImage(src) {
  return new Promise(resolve => {
    if (src in loadImage.__cache__) {
      return resolve(loadImage.__cache__[src])
    }

    const image = new Image()
    image.onload = () => {
      image.width = 614
      image.height = image.height * (image.width / image.naturalWidth) // Keep Y ratio
      image.scaleX = image.naturalWidth / image.width
      image.scaleY = image.naturalHeight / image.height
      loadImage.__cache__[src] = image
      resolve(image)
    }
    image.src = src
  })
}

loadImage.__cache__ = {}

async function drawSoloImages(images, crops, canvases) {
  const crop = crops[0]
  const image = images[0]
  const overlays = ["soloBlack", "soloGray", "soloWhite"]

  overlays.forEach(async (overlay, index) => {
    await drawImageWithOverlay(image, crop, overlay, canvases[index].current)
  })
}

async function drawChallengeBeforeAfter(images, crops, canvases) {
  const { imgW, imgH, positions } = POST_TYPE.CHALLENGE_BEFORE_AFTER
  const canvas = canvases[0].current
  const ctx = canvas.getContext("2d")

  images.forEach(async (image, index) => {
    const crop = crops[index]
    const pos = positions[index]
    const newCrop = {
      ...crop,
      width: imgW * (crop.height / imgH),
      x: crop.x + (imgW / 2) * (crop.height / imgH),
    }

    ctx.drawImage(
      image,
      newCrop.x * image.scaleX,
      newCrop.y * image.scaleY,
      newCrop.width * image.scaleX,
      newCrop.height * image.scaleY,
      pos.x,
      pos.y,
      imgW,
      imgH,
    )
  })

  await drawOverlay("challengeBeforeAfter", canvas)
}

async function drawPaintAlongImages(postType, images, crops, canvases) {
  images.map(async (image, index) => {
    // Draw the individual image
    await drawImageWithOverlay(
      image,
      crops[index],
      "paintAlong1",
      canvases[index + 1].current,
    )
  })

  await drawPaintAlongCover(postType, images, crops, canvases[0].current)
}

async function drawPaintAlongCover(postType, images, crops, canvas) {
  const { overlay, recropW, recropX, imgW, imgH, positions } = postType
  const ctx = canvas.getContext("2d")

  images.forEach(async (image, index) => {
    const crop = crops[index]
    const pos = positions[index]
    const newCrop = {
      ...crop,
      width: crop.width * recropW,
      x: crop.x + crop.width * recropX,
    }

    ctx.drawImage(
      image,
      newCrop.x * image.scaleX,
      newCrop.y * image.scaleY,
      newCrop.width * image.scaleX,
      newCrop.height * image.scaleY,
      pos.x,
      pos.y,
      imgW,
      imgH,
    )
  })

  await drawOverlay(overlay, canvas)
}

async function drawImageWithOverlay(image, crop, overlay, canvas) {
  const ctx = canvas.getContext("2d")
  ctx.drawImage(
    image,
    crop.x * image.scaleX,
    crop.y * image.scaleY,
    crop.width * image.scaleX,
    crop.height * image.scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  await drawOverlay(overlay, canvas)
}

async function drawOverlay(overlay, canvas) {
  const overlayImage = await loadImage(OVERLAYS[overlay])
  const ctx = canvas.getContext("2d")

  ctx.drawImage(
    overlayImage,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
}

export default ImageBuilder
