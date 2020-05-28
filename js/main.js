/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';
import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element@0.6.2/lit-element.js?module';
const video = document.getElementById("video");
class ScreenSharing extends LitElement {
	constructor() {
		super();
		this.enableStartCapture = true;
		this.enableStopCapture = false;
		this.enableDownloadRecording = false;
		this.stream = null;
		this.chunks = [];
		this.mediaRecorder = null;
		this.status = 'Inactive';
		this.recording = null;
	}

	static get properties() {
		return {
			status: String,
			enableStartCapture: Boolean,
			enableStopCapture: Boolean,
			enableDownloadRecording: Boolean,
			recording: {
				type: {
					fromAttribute: input => input
				}
			}
		};
	}

	render() {
		return html`<style>
:host {
  display: block;
  padding: 10px;
  width: 100%;
  height: 100%;
}
</style>
<div>
<p>Status: ${this.status}</p>
<button ?disabled="${!this.enableStartCapture}" @click="${e => this._startCapturing(e)}">Start screen capture</button>
<a id="downloadLink" type="video/webm" style="display: none"></a>
</div>`;
	}

	static _startScreenCapture() {
		const displayMediaOptions = {
			video: {
				cursor: "always"
			},
			audio: false
		};
		return navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
	}

	async _startCapturing(e) {
		this.stream = await ScreenSharing._startScreenCapture();
		video.srcObject = this.stream;
		video.webkitRequestFullscreen();

		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');

		video.addEventListener('play', function() {
			const $this = this; //cache
			(function loop() {
				if (!$this.paused && !$this.ended) {
					ctx.drawImage($this, 0, 0);
					setTimeout(loop, 1000 / 30); // drawing at 30fps
				}
			})();
		}, 0);
		init(canvas)
	}
}

customElements.define('screen-sharing', ScreenSharing);

function init(canvas) {
	setInterval(function() {
		canvas.style.width = window.innerWidth + "px";
		canvas.style.height = window.innerHeight + "px";
	}, 200);
}
