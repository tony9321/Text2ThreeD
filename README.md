Could you let me know what we did? While making a 3D printing object, we figured that we suck at 3D sketching with Blender or Onshape(3D sketching software), thus we decided to use LLM to solve this problem inspired by stable diffusion. To use it, the user will input a prompt like  generate the Python code for a blender for a sphere with a radius of 2 inches, then press the generate button, it will then call groq API and llma3 to generate the Python code. Once we got the Python code, we changed it to three.js code and presented it on the frontend. 
Advantage: for people who aren't good at 3d sketching like doctors who sometimes need to make prostheses for patients, they can describe what they want and have a base model. For people who are amateur makers, I don't need to learn that much about 3D sketching as well. 

What we can improve: Rag, fine tuning, let the user take picture and draft it

demo video(sorry I was talking to my mom in the video): 
https://youtu.be/iQZulfzptm4
https://youtu.be/o_hBAAq1KqY
https://youtu.be/h1xP55Jthyg
https://youtu.be/ifn-N6NWTlk
1. git clone https://github.com/tony9321/refactored-succotash.git 
2. npm install
3. try to ask a question like generate the Python code for blender for a sphere with a radius of 2 inches or a cube or some simple object first, it might not always work(you can keep regenerating or change the prompt a little bit), but use the bottom preview part to verify if you can see it
4. play with the prompt and think about how we can refine it to make more complex objects
