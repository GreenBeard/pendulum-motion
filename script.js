var g = -9.81;

function recreateAnimation() {
  var canvas = document.getElementById("pendulum-canvas");
  if (canvas === null) {
    // In case the DOM has not loaded yet.
    return;
  }
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  var stringLength = parseFloat(document.getElementById("string-length").value);
  var weightMass = parseFloat(document.getElementById("weight-mass").value);
  var angleDegrees = parseFloat(document.getElementById("angle-degrees").value);
  var iterationFrequency = parseFloat(
    document.getElementById("iteration-frequency").value
  );

  if (
    isNaN(stringLength) ||
    isNaN(weightMass) ||
    isNaN(angleDegrees) ||
    isNaN(iterationFrequency)
  ) {
    console.log("Boo!");
    context.font = "20px Georgia";
    context.fillStyle = "red";
    context.fillText("One of the inputs is not a number", 0, canvas.height / 2);
    return;
  }

  var angleRadians = angleDegrees * (2 * Math.PI / 360);

  console.log(".");
  // (0, 0) is the base of the pendulum.
  // Angle starts at 0 to the bottom
  startLowAnglePendulum(g, stringLength, angleRadians);  
}

var animationTaskId;
function startLowAnglePendulum(gravity, stringLength, angleRadians) {
  var gravity = Math.abs(gravity);
  var stringLength = stringLength;
  var angleRadians = angleRadians;
  animationTask = requestAnimationFrame(function animate(millisecondTime) {
    var canvas = document.getElementById("pendulum-canvas");
    var context = canvas.getContext("2d");
    var theta =
      angleRadians *
      Math.cos(Math.sqrt(gravity / stringLength) * millisecondTime / 1000);

    renderAnimation(context, canvas.width, canvas.height, theta, stringLength);

    animationTask = requestAnimationFrame(animate);
  });
}

function stopLowAnglePendulum() {
  if (animationTask !== undefined) {
    cancelAnimationFrame(animationTask);
  }
}

// Angle starts at 0 to the bottom
function renderAnimation(ctx, width, height, angle, length) {
  length = length * 200;
  // Attachment of the pendulum
  var baseX = width / 2;
  var baseY = 50;
  var weightX = baseX + length * Math.sin(angle);
  var weightY = baseY + length * Math.cos(angle);
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.fillStyle = "#2B2";
  ctx.arc(baseX, baseY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = "#000";
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(weightX, weightY);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = "#22B";
  ctx.arc(weightX, weightY, 10, 0, 2 * Math.PI);
  ctx.fill();
}
