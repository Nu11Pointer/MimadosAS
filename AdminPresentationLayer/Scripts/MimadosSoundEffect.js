// Efectos de Audio
var volume = 0.15;
const successAudio = new Audio('/Content/Audio/success.wav');
const warningAudio = new Audio('/Content/Audio/warning.wav');
const errorAudio = new Audio('/Content/Audio/error.wav');

successAudio.volume = warningAudio.volume = errorAudio.volum = volume;