import React from "react"
import ReactCrop from "react-image-crop"

import OVERLAYS from "./overlays"

import { Icon } from "./ui"
import styles from "./styles.css"

const T = styles.tags(styled => ({
  ImageBuilder: styled.div(styles.imageBuilder),
  Cropper: styled.div(styles.cropper),
  Uploader: styled.div(styles.uploader),
  DownloadLink: styled.a(styles.downloadLink),
  Actions: styled.div(styles.actions),
  Picker: styled.div(styles.picker),
  Radio: styled.div(styles.radio),
  Select: styled.select(styles.select),
  Output: styled.a(styles.output),
}))

const POST_TYPE = {
  SOLO: {
    name: "Single",
    required: 1,
    outputs: 3,
  },
  PAINT_ALONG_2: {
    family: "paint-along",
    name: "Paint Along (2)",
    required: 2,
    outputs: 3,
    imgW: 285,
    imgH: 513,
    positions: [{ x: 14, y: 17 }, { x: 315, y: 17 }],
  },
  PAINT_ALONG_3: {
    family: "paint-along",
    name: "Paint Along (3)",
    required: 3,
    outputs: 4,
    disabled: true,
  },
  PAINT_ALONG_4: {
    family: "paint-along",
    name: "Paint Along (4)",
    required: 4,
    outputs: 5,
    disabled: true,
  },
  PAINT_ALONG_5: {
    family: "paint-along",
    name: "Paint Along (5)",
    required: 5,
    outputs: 6,
    disabled: true,
  },
  PAINT_ALONG_6: {
    family: "paint-along",
    name: "Paint Along (6)",
    required: 6,
    outputs: 7,
    disabled: true,
  },
  PAINT_ALONG_7: {
    family: "paint-along",
    name: "Paint Along (7)",
    required: 7,
    outputs: 8,
    disabled: true,
  },
  PAINT_ALONG_8: {
    family: "paint-along",
    name: "Paint Along (8)",
    required: 8,
    outputs: 9,
    disabled: true,
  },
  CHALLENGE: {
    name: "Challenge",
    required: 1,
    outputs: 1,
    disabled: true,
  },
  CHALLENGE_BEFORE_AFTER: {
    name: "Challenge (Before/After)",
    required: 2,
    outputs: 1,
    imgW: 286,
    imgH: 513,
    positions: [{ x: 14, y: 17 }, { x: 315, y: 17 }],
  },
}

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
      ).then(images => {
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

  onUpdateCrop = index => crop =>
    this.setState(prevState => {
      const newCrops = prevState.crops.slice()
      newCrops[index] = crop
      return { crops: newCrops }
    })

  topRef = React.createRef()

  async componentDidUpdate() {
    if (this.state.step < 3) {
      return
    }

    const { postType: postTypeKey, images, crops, canvases } = this.state
    const postType = POST_TYPE[postTypeKey]

    if (postType === POST_TYPE.SOLO) {
      await drawSoloImages(images, crops, canvases)
    } else if (postType === POST_TYPE.CHALLENGE_BEFORE_AFTER) {
      await drawChallengeBeforeAfter(images, crops, canvases)
    } else if (PAINT_ALONG_POST_TYPES.includes(postType)) {
      await drawPaintAlongImages(postType, images, crops, canvases)
    }
  }

  render() {
    const { step, postType, uploads, images, crops, canvases } = this.state

    return (
      <T.ImageBuilder>
        <h2 ref={this.topRef}>Image builder</h2>
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
              onUpdateCrop={this.onUpdateCrop}
              onNextStep={this.onSetStep(3)}
            />
          ),
          () => <ResultStep canvases={canvases} />,
        ][step]()}
      </T.ImageBuilder>
    )
  }
}

function PostTypeStep({ postType, onChangeType, onNextStep }) {
  return (
    <form>
      <T.Picker>
        <p>Choose album type</p>
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
      <p>Select {postType.required} images</p>
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

function CropStep({ postType, images, crops, onUpdateCrop, onNextStep }) {
  return (
    <T.Cropper>
      {images.map((image, index) => (
        <React.Fragment key={image.file.name}>
          <h3>{image.file.name}</h3>
          <ReactCrop
            imageStyle={{ width: "614px" }}
            src={image.dataURL}
            crop={crops[index]}
            onChange={onUpdateCrop(index)}
          />
        </React.Fragment>
      ))}
      <T.Actions>
        <button
          onClick={onNextStep}
          disabled={crops.some(crop => !crop.width || !crop.height)}
        >
          Confirm cropping
        </button>
      </T.Actions>
    </T.Cropper>
  )
}

function ResultStep({ canvases }) {
  const now = +new Date()

  const onDownload = ref => ev => {
    const canvas = ref.current
    const dataURL = canvas.toDataURL("image/jpeg")
    ev.currentTarget.setAttribute("href", dataURL)
  }

  return (
    <T.Picker>
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
    </T.Picker>
  )
}

function loadImage(src) {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => {
      image.width = 614
      image.height = image.height * (image.width / image.naturalWidth) // Keep Y ratio
      image.scaleX = image.naturalWidth / image.width
      image.scaleY = image.naturalHeight / image.height
      resolve(image)
    }
    image.src = src
  })
}

async function drawSoloImages(images, crops, canvases) {
  const crop = crops[0]
  const image = await loadImage(images[0].dataURL)
  const overlays = ["soloBlack", "soloGray", "soloWhite"]

  overlays.forEach(async (overlay, index) => {
    await drawImageWithOverlay(image, crop, overlay, canvases[index].current)
  })
}

async function drawChallengeBeforeAfter(images, crops, canvases) {
  const { required, imgW, imgH, positions } = POST_TYPE.CHALLENGE_BEFORE_AFTER
  const canvas = canvases[0].current
  const ctx = canvas.getContext("2d")

  images.forEach(async (source, index) => {
    const image = await loadImage(source.dataURL)
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
  images.map(async (source, index) => {
    const image = await loadImage(source.dataURL)

    // Draw the individual image
    await drawImageWithOverlay(
      image,
      crops[index],
      "paintAlong1",
      canvases[index + 1].current,
    )

    return image
  })

  await drawPaintAlongCover(postType, images, crops, canvases[0].current)
}

async function drawPaintAlongCover(postType, images, crops, canvas) {
  const { required, imgW, imgH, positions } = postType
  const overlay = `paintAlong${required}`
  const ctx = canvas.getContext("2d")

  images.forEach(async (source, index) => {
    const image = await loadImage(source.dataURL)
    const crop = crops[index]
    const pos = positions[index]
    const newCrop = {
      ...crop,
      width: imgW * (crop.height / imgH),
      x: crop.x + (imgW / 2) * (crop.height / imgH),
    }

    switch (postType) {
      case POST_TYPE.PAINT_ALONG_2:
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
        break
      default:
        console.log("other")
    }
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
