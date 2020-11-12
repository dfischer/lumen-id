class Lumen {
  constructor(_person) {
    this.person = _person;

    // this.lumenID = createGraphics();
    // this.lumenZoom = createGraphics();
    // this.skeletonImage = createGraphics();

    // Configuration for rendering Lumen shape.
    this.config = {
      // Min and max radius for Lumen shape
      minR: 250,
      maxR: 400
    }

    this.util = new Utility();

    // Anchor point for shape from where lumen pts will be calculated
    this.anchorPt = createVector(width / 2, height / 2 - height / 8);
    // this.anchorPt = createVector(width / 2, height / 2);

    // Position vector for the centroid of the shape created
    this.centroid = createVector(0, 0);

    // Array of lumen pts for this person
    this.lumenArray = [];
    this.letterArray = [];

    // Whitespaces and special character from name is removed and make CAPs
    let letters = this.person.name.trim().replaceAll(" ", "").replaceAll(".", "").toUpperCase().split("");
    this.letterArray = letters;

    // Array of ASCII values for respective characters
    let nums = this.util.letterToNum(letters);

    for (let i = 0; i < nums.length; i++) {
      // Alphabet position is mapped with distance of lumen pt from its anchor point
      // Angles are marked equally around the circle with numbers of letter in the name
      let reach = constrain(
        map(nums[i], 26, 1, this.config.maxR, this.config.minR),
        0, max(width, height));

      this.lumenArray.push(createVector(
        reach * cos(-HALF_PI + TAU / nums.length * i),
        reach * sin(-HALF_PI + TAU / nums.length * i))
      );
    }

    this.calculateCentroid();
  }

  calculateCentroid() {
    for (let lumen of this.lumenArray) {
      this.centroid.add(lumen);
    }
    this.centroid.div(this.lumenArray.length);
  }

  renderLumen(_x, _y) {
    let divs = this.lumenArray.length;
    strokeCap(ROUND);
    noFill();

    // Curve tightness is mapped with length of the name
    curveTightness(map(this.lumenArray.length, 5, 20, -2, -1));
    // curveTightness(1);

    for (let j = 0; j < 20; j++) {
      strokeWeight(3.5);
      stroke(240, 200, 45, 255 - 15 * j);
      // 218, 186, 96

      push();
      beginShape();
      for (let lumenPt of this.lumenArray) {
        let r = dist(0, 0, lumenPt.x, lumenPt.y) - 10 * j;
        let ang = lumenPt.heading();
        let pt = createVector(r * cos(ang), r * sin(ang))
        curveVertex(_x + pt.x, _y + pt.y);
      }
      endShape(CLOSE);
      pop();
    }
  }

  renderPointers() {
    strokeWeight(6);

    stroke(237, 191, 34);
    point(width / 2, height / 2);

    stroke(5);
    point(this.centroid.x, this.centroid.y);
  }

  renderBrandImages() {
    push();
    imageMode(CENTER);
    image(dilogo, width / 2, height / 2 - height / 8, min(width, height) / 10, min(width, height) / 10);
    pop();

    push();
    imageMode(CORNER);
    let aspr = vllogo.width / vllogo.height;
    tint(255, 127); // Display at half opacity
    image(vllogo, width - 4 * width / 25, height / 30 * width / height, 21 * aspr, 21);
    pop();
  }

  renderPersonInfo() {
    textFont(poppins_bold);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(218, 186, 96);

    let voff = 75;

    // ATTENDEE NAME
    textSize(width / 18);
    text(this.person.name.toUpperCase(),
      width / 2, height - 7 * height / 25 + voff);

    // ATTENDEE / SPEAKER / VOLUNTEER BANNER
    rectMode(CENTER);
    rect(width / 2, height - 2.5 * height / 25 + voff, width, height / 13);

    fill(2);
    textSize(width / 35)
    text('ATTENDEE - DESIGN INSPIRE CONFERENCE 2020',
      width / 2, height - 2.55 * height / 25 + voff);

    // ATTENDEE PROFESSION
    fill(218, 186, 96);
    text(this.person.profession.toUpperCase(),
      width / 2, height - 4.75 * height / 25 + voff);

    // SEPARATOR
    stroke(218, 186, 96);
    strokeWeight(3);
    line(
      width / 2 - 30, height - 5.65 * height / 25 + voff,
      width / 2 + 30, height - 5.65 * height / 25 + voff
    );
  }

  renderLumenIDCard() {
    background(10);

    push();
    translate(-2 * this.centroid.x, -2 * this.centroid.y);
    this.renderLumen(this.anchorPt.x, this.anchorPt.y);
    pop();

    this.renderBrandImages();
    this.renderPersonInfo();
    // this.renderPointers();
  }

  renderClearLumens() {
    clear();

    push();
    translate(-2 * this.centroid.x, -2 * this.centroid.y);
    this.renderLumen(this.anchorPt.x, this.anchorPt.y);
    pop();
  }

  renderDebugUserDetails() {
    noStroke();
    fill(237, 191, 34);

    textFont('monospace');
    // textStyle(BOLD)
    textSize(17);
    textAlign(LEFT);
    text(
      'DESIGN INSPIRE 2020 \nUxG ValueLabs \n-\n' +
      this.person.name.toUpperCase() + '\n2020.' +
      this.util.pad(this.person.id, 4),
      30, 90);
  }

  renderSkeletonImage() {
    background(20);

    let divs = this.lumenArray.length;
    strokeCap(ROUND);

    // Curve tightness is mapped with length of the name
    curveTightness(map(this.lumenArray.length, 5, 20, -2, -1));
    // curveTightness(1);

    for (let j = 0; j < 3; j++) {
      strokeWeight(1.5);
      stroke(240, 200, 45, 55 - 15 * j);

      if (j == 0) {
        strokeWeight(1.5);
        stroke(240, 200, 45);
        fill(240, 200, 45, 3);
      }
      // 218, 186, 96

      beginShape();
      let count = 0;
      for (let lumenPt of this.lumenArray) {
        let r = dist(0, 0, lumenPt.x, lumenPt.y) - 10 * j;
        let ang = lumenPt.heading();
        let pt = createVector(r * cos(ang), r * sin(ang))
        curveVertex(this.anchorPt.x + pt.x, this.anchorPt.y + pt.y);

        strokeWeight(5.5);
        point(this.anchorPt.x + pt.x, this.anchorPt.y + pt.y);

        strokeWeight(1.5);
        textAlign(CENTER, CENTER);
        text(
          this.letterArray[count],
          this.anchorPt.x + (r + 20) * cos(ang), this.anchorPt.y + (r + 20) * sin(ang)
        );

        count += 1;
      }
      endShape(CLOSE);

      strokeWeight(5.5);
      point(
        this.anchorPt.x + this.config.maxR * cos(frameCount / 100 - HALF_PI),
        this.anchorPt.y + this.config.maxR * sin(frameCount / 100 - HALF_PI)
      );
      strokeWeight(1);
      ellipseMode(CENTER);
      ellipse(
        this.anchorPt.x + this.config.maxR * cos(frameCount / 100 - HALF_PI),
        this.anchorPt.y + this.config.maxR * sin(frameCount / 100 - HALF_PI),
        20 * cos(frameCount / 10)
      )

      this.renderGrids();
    }
  }

  renderGrids(_x = this.anchorPt.x, _y = this.anchorPt.y) {
    noFill();
    strokeWeight(2);
    stroke(240, 200, 45, 25);
    ellipseMode(CENTER);

    ellipse(_x, _y, this.config.maxR * 2);
    ellipse(_x, _y, this.config.minR * 2);
  }
}
