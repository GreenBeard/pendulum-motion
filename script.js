function recreateAnimation() {
  var canvas = document.getElementById("pendulum-canvas");
  if (canvas === null) {
    // In case the DOM has not loaded yet.
    return;
  }
  stopLowAnglePendulum();
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  var stringLength = parseFloat(document.getElementById("string-length").value);
  var weightMass = parseFloat(document.getElementById("weight-mass").value);
  var angleDegrees = parseFloat(document.getElementById("angle-degrees").value);

  if (
    isNaN(stringLength) ||
    isNaN(weightMass) ||
    isNaN(angleDegrees)
  ) {
    context.font = "20px";
    context.fillStyle = "red";
    context.fillText("One of the inputs is not a number", 0, canvas.height / 2);
    return;
  }

  document.getElementById('angle-degrees-out').innerHTML = angleDegrees + " degrees";
  var angleRadians = angleDegrees * (2 * Math.PI / 360);

  console.log(".");
  // (0, 0) is the base of the pendulum.
  // Angle starts at 0 to the bottom
  startLowAnglePendulum(-9.81, stringLength, angleRadians);
}

var animationTaskId;
function startLowAnglePendulum(gravity, stringLength, angleRadians) {
  var gravity = Math.abs(gravity);
  var stringLength = stringLength;
  var angleRadians = angleRadians;
  animationTaskId = requestAnimationFrame(function animate(millisecondTime) {
    var canvas = document.getElementById("pendulum-canvas");
    var context = canvas.getContext("2d");
    var theta =
      angleRadians *
      Math.cos(Math.sqrt(gravity / stringLength) * millisecondTime / 1000);

    renderAnimation(context, canvas.width, canvas.height, theta, stringLength);

    animationTaskId = requestAnimationFrame(animate);
  });
}

function stopLowAnglePendulum() {
  if (animationTaskId !== undefined) {
    cancelAnimationFrame(animationTaskId);
  }
}

function downloadCSV() {
  var angle = eval(prompt("Angle of iteration (degrees)"));
  var iteration = eval(prompt("Iteration (sec)", "1/30"));
  var length = eval(prompt("String length (m)", "40/100"));
  if (confirm("Angle: " + angle + " degrees. Iteration: " + iteration + " sec. Length: " + length + " m.")) {
    saveData(createCSV(9.81, angle/360*2*Math.PI, 40 / 100, 1/30, 3), angle + "degrees.csv");
  }
}

function saveData(data, fileName) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  blob = new Blob([data], {type: "octet/stream"});
  url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

function createCSV(gravity, startAngle, stringLength, interval, swings) {
  var csv = [];
  var timeSec = 0;
  var lastAngle = null;
  var swingsComplete = 0;
  while (true) {
    var angle =
      startAngle *
      Math.cos(Math.sqrt(gravity / stringLength) * timeSec);
    if (lastAngle != null) {
      if (swingsComplete % 2 == 0 && angle >= lastAngle) {
        swingsComplete++;
      } else if (swingsComplete % 2 == 1 && angle <= lastAngle) {
        swingsComplete++;
      }
      if (swingsComplete >= swings) {
        break;
      }
    }
    var weightX = -stringLength * Math.sin(angle);
    var weightY = -stringLength * Math.cos(angle);
    csv.push(timeSec + ',' + weightX + ',' + weightY);

    timeSec += interval;
    lastAngle = angle;
  }
  return csv.join('\n');
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
