export default `
  <!DOCTYPE html>
  <html>
    <head>
      <title>KAVR</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.min.css" /> 
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Black+Ops+One|Changa|Cormorant+Unicase" rel="stylesheet">
    </head>
    <body>
      <audio id="moron">
        <source src="audio/moron.m4a" type="audio/mp4">
      </audio>
      <audio id="stupid">
        <source src="audio/stupid.m4a" type="audio/mp4">
      </audio>
      <audio id="english">
        <source src="audio/goodenglish.m4a" type="audio/mp4">
      </audio>
      <div id="app"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r78/three.min.js"></script>
      <script src="http://threejs.org/examples/js/controls/OrbitControls.js"></script>
      <script src="bundle.js"></script>
    </body>
  </html>
`;
