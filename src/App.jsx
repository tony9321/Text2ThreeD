import React, { useState, useRef, useEffect } from 'react';
import Groq from 'groq-sdk';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';

const API_KEY = '';

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [transcribedCode, setTranscribedCode] = useState('');
  const canvasRef = useRef(null);

  const handleGenerate = async () => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-70b-versatile',
      });
      const pythonCode = chatCompletion.choices[0]?.message?.content || '';
      setGeneratedCode(pythonCode);
      handleTranscribe(pythonCode);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleTranscribe = async (pythonCode) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Transcribe the following Python code to Three.js code. Provide only the code to create an object based on the user's input and add it to a 3D scene with MeshPhongMaterial, appropriate lighting, and a 3D background. Do not include any import statements, explanations, or other module-level declarations. The code should only include the creation of the object, the material, the lighting, and adding them to the scene:\n\n${pythonCode}`,
          },
        ],
        model: 'llama-3.1-70b-versatile',
      });
      let threeJsCode = chatCompletion.choices[0]?.message?.content || '';
      
      // Remove any non-code content
      threeJsCode = threeJsCode.replace(/```javascript|```/g, '').trim();
      
      setTranscribedCode(threeJsCode);
      renderThreeJsCode(threeJsCode);
    } catch (error) {
      console.error('Error transcribing code:', error);
    }
  };

  const renderThreeJsCode = (code) => {
    if (!canvasRef.current) return;

    // Clear previous scene
    while (canvasRef.current.firstChild) {
      canvasRef.current.removeChild(canvasRef.current.firstChild);
    }

    // Create a new scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.background = new THREE.Color(0x000000); 

    // Add a basic light to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Add a 3D background
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('path/to/your/background.jpg');
    scene.background = backgroundTexture;

    // Add XYZ axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add OrbitControls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI; 

    // Log the generated Three.js code
    console.log('Generated Three.js Code:', code);

    // Execute the generated Three.js code
    try {
      // eslint-disable-next-line no-new-func
      new Function('THREE', 'scene', 'camera', 'renderer', code)(THREE, scene, camera, renderer);
    } catch (error) {
      console.error('Error executing Three.js code:', error);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); 
      renderer.render(scene, camera);
    };

    animate();


    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
          />
          <button onClick={handleGenerate}>Generate</button>
        </div>
        {generatedCode && (
          <div className="output-container">
            <h3>Generated Python Code:</h3>
            <pre className="code-container">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
        {transcribedCode && (
          <div className="output-container">
            <h3>Transcribed Three.js Code:</h3>
            <pre className="code-container">
              <code>{transcribedCode}</code>
            </pre>
          </div>
        )}
        <canvas ref={canvasRef} className="canvas-container"></canvas>
      </header>
    </div>
  );
}

export default App;
