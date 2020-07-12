import { Message, Event } from '../common/consts';

const video = document.createElement('video');
video.muted = true;
video.width = 640;
video.height = 640;

const createElement: typeof document.createElement = document.createElement.bind(document);

let audio: HTMLAudioElement | null = null;

video.addEventListener('enterpictureinpicture', () => {
  const msg: Message = { type: Event.POPUP_ACTIVE, data: true };
  window.postMessage(msg, '*');
});
video.addEventListener('leavepictureinpicture', () => {
  const msg: Message = { type: Event.POPUP_ACTIVE, data: false };
  window.postMessage(msg, '*');
});

// safari not support media session, pip contorl video
video.addEventListener('play', () => {
  audio?.play();
});
video.addEventListener('pause', () => {
  audio?.pause();
});

document.createElement = function<K extends keyof HTMLElementTagNameMap>(tagName: K, options: ElementCreationOptions) {
  const element = createElement(tagName, options);
  if (tagName === 'video') {
    if (!audio) {
      audio = element as HTMLAudioElement;
      if (navigator.mediaSession) {
        const mediaSession = navigator.mediaSession;
        audio.addEventListener('play', () => {
          video.play();
          mediaSession.playbackState = 'playing';
        });
        audio.addEventListener('pause', () => {
          video.pause();
          mediaSession.playbackState = 'paused';
        });
      }
    } else {
      // ignore spotify pip video
    }
  }
  return element;
};

export { video, audio };
