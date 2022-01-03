const getDisplayMedia = async () => {
  try {
    const constraints = {
      video: {
        cursor: "always"
      },
      // audio: {
      //   echoCancellation: true,
      //   noiseSuppression: true,
      //   sampleRate: 44100
      // }
      auto: false
    };
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch (err) {
    console.error("You need to allow sharing screen");
  }
};

export default getDisplayMedia;