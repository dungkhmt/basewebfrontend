const getUserMedia = async (type) => {
  try {
    const constraints = (type === 'micro') ? {
      video: false,
      audio: true,
    } : {
      video: true,
      audio: false,
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error(err);
    alert('We need your permission to use the camera and microphone!');
  }
};

export default getUserMedia;