
  var counties17_no_canada = /* color: 00ffff */ee.Geometry.Polygon(
        [[[-118.3447265625, 49.023461463214126],
          [-123.33251953125, 48.99463598353405],
          [-123.046875, 48.821332549646634],
          [-123.24462890625, 48.66194284607006],
          [-123.1787109375, 48.4146186174932],
          [-123.4423828125, 48.28319289548349],
          [-123.92578125, 48.268569112964336],
          [-124.892578125, 48.48748647988415],
          [-124.56298828125, 47.47266286861342],
          [-124.1455078125, 46.22545288226939],
          [-124.12353515625, 45.24395342262325],
          [-123.134765625, 45.089035564831036],
          [-122.98095703125, 45.27488643704892],
          [-121.53076171875, 45.10454630976873],
          [-121.4208984375, 45.30580259943578],
          [-119.9267578125, 45.089035564831036]]]);


var whichDigitofSequences = '2630c_6numSeq'

////Updated by morgan with descriptions of masks added in at Friday April 1 at 3pm
// test environment
var FirstSequencesArray = [
  
  ////6 Digit - Ag Contraction
      [8, 8, 8, 4, 6, 4]
      , [8, 8, 8, 4, 6, 6]
      , [8, 8, 8, 4, 6, 7]
      , [8, 8, 8, 4, 7, 4]
      , [8, 8, 8, 4, 7, 6]
      , [8, 8, 8, 4, 7, 7]
      , [8, 8, 8, 6, 4, 4]
      , [8, 8, 8, 6, 4, 6]
      , [8, 8, 8, 6, 4, 7]
      , [8, 8, 8, 6, 7, 4]
      , [8, 8, 8, 6, 7, 6]
      , [8, 8, 8, 6, 7, 7]
      , [8, 8, 8, 7, 4, 4]
      , [8, 8, 8, 7, 4, 6]
      , [8, 8, 8, 7, 4, 7]
      , [8, 8, 8, 7, 6, 4]
      , [8, 8, 8, 7, 6, 6]
      , [8, 8, 8, 7, 6, 7]
      , [8, 8, 8, 7, 7, 7]
      , [8, 8, 8, 6, 6, 6]
      , [8, 8, 8, 5, 5, 5]
      , [8, 8, 8, 4, 4, 4]
  
  
  
  //// 4 Digit - Ag Contraction
  // [8, 8, 7, 7]
  // , [8, 8, 7, 6]
  // , [8, 8, 7, 4]
  // , [8, 8, 6, 4]
  // , [8, 8, 4, 4]
  // , [8, 8, 4, 7]
  // , [8, 8, 4, 6]
  // , [8, 8, 6, 6]
  // , [8, 8, 6, 7]
  // , [8, 8, 5, 5]


];

var secondSequencesArray = [
    ///[3, 3, 3, 3]
    // [8, 8, 8, 8]
  // ,     [5, 5, 5, 5]
 ///any class, other than non-changing ones (snow,water,wetlands)
  //   [4,4]
  // , [5,5]
  // , [6,6]
  // , [7,7]
  // //, [8,8]
  // , [4,6]
  // , [4,7]
  // , [7,6]
  ];


var baseimageunremapped= ee.Image('USGS/NLCD/NLCD2001').select('landcover');
var baseimage = baseimageunremapped;
  
var NLCD_water = baseimageunremapped.select('landcover')
                      .remap([11,12,21,22,23,24,31,41,42,43,52,71,81,82,90,95],
                            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])//.reproject('EPSG:32610',[30,0,465285,0,-30,5365215])




var images = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A');
var images2 = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A2');
var images3 = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A3')
var images4 = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A4')
var images5 = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A5b')
var images6 = ee.Image('users/alemlakes/BULC/2500/2630/SelectedBULCClassifications-2630-A6d')



var stack1 = [];
var stack2 = [];
var stack3 = [];
var stack4 = [];
var stack5 = [];
var stack6 = [];

var numberOfBands1  = images.bandNames().length().getInfo() 
var numberOfBands2  = images2.bandNames().length().getInfo()
var numberOfBands3  = images3.bandNames().length().getInfo()
var numberOfBands4  = images4.bandNames().length().getInfo()
var numberOfBands5  = images5.bandNames().length().getInfo()
var numberOfBands6  = images6.bandNames().length().getInfo()


print ("number of bands first image: " +numberOfBands1)
print ("number of bands second image: " +numberOfBands2)
print ("number of bands third image: " +numberOfBands3)
print ("number of bands fourth image: " +numberOfBands4)
print ("number of bands fifth image: " +numberOfBands5)
print ("number of bands sixth image: " +numberOfBands6)


//Map 17 Counties Study Area
var Puget_17Counties = ee.Image('users/alemlakes/BULC/2500/PugetCounties_Strata_Counties_30m')
var Puget_17Counties_lt = Puget_17Counties.lt(65530)
var Puget_17Counties_studyarea = Puget_17Counties.updateMask(Puget_17Counties_lt)
//afn_MapLayer(Puget_17Counties_studyarea,1,1,BW_Palette,"17 Counties Study Area",true)

var Puget_17Counties_studyarea = Puget_17Counties_studyarea.gt(0)
var exact_county_boundaries = Puget_17Counties_studyarea.addBands(Puget_17Counties_studyarea).reduceToVectors({
  reducer: ee.Reducer.anyNonZero(),
  scale: 30,
  maxPixels: 4e9,
  tileScale: 16})



for(var i = 0; i <numberOfBands1; i++ ) {
  stack1[i] = afn_combineBurn(NLCD_water,images.select(i).clip(exact_county_boundaries))
}

for(var i = 0; i <numberOfBands2; i++ ) {
  stack2[i] = afn_combineBurn(NLCD_water,images2.select(i).clip(exact_county_boundaries))
}
for(var i = 0; i <numberOfBands3; i++ ) {
  stack3[i] = afn_combineBurn(NLCD_water,images3.select(i).clip(exact_county_boundaries))
}
for(var i = 0; i <numberOfBands4; i++ ) {
  stack4[i] = afn_combineBurn(NLCD_water,images4.select(i).clip(exact_county_boundaries))
}
for(var i = 0; i <numberOfBands5; i++ ) {
  stack5[i] = afn_combineBurn(NLCD_water,images5.select(i).clip(exact_county_boundaries))
}
for(var i = 0; i <numberOfBands6; i++ ) {
  stack6[i] = afn_combineBurn(NLCD_water,images6.select(i).clip(exact_county_boundaries))
}


var temp = stack1;
var temp2 = temp.concat(stack2)
var temp3 = stack3;
var temp4 = temp3.concat(stack4);
 var temp5 = temp4.concat(stack5);
 var temp6 = stack6;

var posteriorarray_MSS = temp2
var posteriorarray_LT5 = temp5//.concat(stack4);
var posteriorarray_LC8S2 = temp6

var posteriorarray_AllimgsForSequencer = posteriorarray_MSS.concat(posteriorarray_LT5)
var posteriorarray_AllimgsForSequencer = posteriorarray_AllimgsForSequencer.concat(posteriorarray_LC8S2)

var AnnualPosteriorCollection_MSS = ee.ImageCollection(posteriorarray_MSS)
var AnnualPosteriorCollection_LT5 = ee.ImageCollection(posteriorarray_LT5)
var AnnualPosteriorCollection_LC8S2 = ee.ImageCollection(posteriorarray_LC8S2)
var AnnualPosteriorCollection = ee.ImageCollection(posteriorarray_AllimgsForSequencer)

var imgarray = posteriorarray_AllimgsForSequencer

var minposteriors = 1;
var maxposteriors = 9;
var numclassbaseimg = 9; //number of classes in base image
var numclasseventimg = 9; //number of classes in event image
var run = '';

var geometrytouse = counties17_no_canada//exact_county_boundaries
var purposeofsequencer = 'AgContract'
var sensorused = 'MSSLT5LC8S2'
var yearscovered ='1972to2016'
var outputfolderingoogledocs = '2630'

var NLCDPalette_impClasses = [ //colour palette for NLCD 2001
    //'000000', //Nodata - 0 -
    //'000000', // null. Black.
    '668CBE', //11 - 00 - Open Water
    'FFFFFF', //12  - 01 - Perennial Ice/Snow
    //'E1CDCE', //21  - 02 - Developed, Open Space
    //'DC9881', //22  - 03 - Developed, Low Intensity
    'F10100', //23 - 04 - Developed, Medium Intensity
    //'AB0101', //24 - 05 - Developed, High Intensity
    'FF00FF', //31 - 06 - Barren Land (Rock/Sand/Clay)'B3AFA4'
    //'68A966', //41 - 07 - Deciduous Forest
    '1D6533', //42 - 08 - Evergreen Forest
    //'BDCC93', //43 - 09 - Mixed Forest
    'D1BB82', //52 - 10 - Shrub/Scrub
    'EDECCD', //71 - 11 - Grassland/Herbaceous
    'DDD83E', //81 - 12 - Pasture/Hay
    //'AE7229', //82 - 13 - Cultivated Crops
    'BBD7ED', //90 - 14 - Woody Wetlands
    //'71A4C1', //95 - 15 - Emergent Herbaceous Wetlands
    //'000000', // null. Black.
];

var gradient_Palette = [
    '9c9c9c', '281DF2', '2723EF', '2729EC', '272FE9', '2735E6', '273BE3', '2641E0', '2647DD', '264DDA', '2653D7', '2659D4', '255FD1', '2565CE', '256BCC', '2571C9', '2577C6', '247DC3', '2483C0', '2489BD', '248FBA', '2495B7', '239BB4', '23A1B1', '23A7AE', '23ADAB', '23B3A8', '23BAA6'
];


var rainbow_Palette = [
    '9c9c9c', 'FF0000', 'FF3900', 'FF7100', 'FFAA00', 'FFE300', 'E3FF00', 'AAFF00', '71FF00', '39FF00', '00FF00', '00FF39', '00FF71', '00FFAA', '00FFE3', '00E3FF', '00AAFF', '0071FF', '0039FF', '0000FF', '3900FF', '7100FF', 'AA00FF', 'E300FF', 'FF00E3', 'FF00AA', 'FF0071', 'FF0039'
]

var Sleeter_Palette = [
    '1a0bff', //water
    'fffdfd', //snow
    'ff0000', //developed
    'ff0bec', //barren
    '26bc24', //forest
    'fbff05', //shrub
    'feffa8', //grass
    'ff9c07', //ag
    '21ffff', //wetlands
];

Map.addLayer(AnnualPosteriorCollection, {
    palette: Sleeter_Palette
    , min: minposteriors
    , max: maxposteriors
}, "Sequences for all Years", false);


function afn_getsmallernonzeronumber(thefirst, thesecond) {
    // this function gets the smaller number of two layers, but not zero. thus calling this on a pixel
    // with the values 3 and 2 gives 2.  on 3 and 0 gives 3. on 2 and 3 gives 3. order does not matter.
    var thefirstnined = thefirst.where(thefirst.eq(0), 999)
    var thesecondnined = ee.Image(thesecond).where(ee.Image(thesecond).eq(0), 999)
    var themin = thefirstnined.min(thesecondnined)
    var thereturn = themin.where(themin.eq(999), 0)


    return (thereturn)
}



function afn_getearliestnonzeromatch(theminimg, themaximg) {
    // this function gets the earliest match of a sequence given these
    // two inputs.  The first match, represented by "theminimg', and the
    // last match, represented by 'themaximg'. where they are nonzero and
    // the same, there was only one match and we can report either one.
    // where the min is less than the match, we want the min. Unless it
    // is zero, bc zero means no match. so we want the min except where 
    // the min is zero, then we want the max. at least I think that's what
    // we're doing here!!

    // get earliest match. it is complex.
    var maxgtmin = themaximg.gt(theminimg)
    var mask1 = maxgtmin.multiply(theminimg).neq(0);
    var invmask1 = mask1.neq(0)
    var mask1min = mask1.multiply(theminimg)
    var invmask1max = invmask1.multiply(themaximg)
    var theearliestnonzeromatch = mask1min.add(invmask1max)


    return (theearliestnonzeromatch)
}


function afn_matchASingleSequence(imgarray, seq) {

    var matchDailyStack = ee.Image();
    print('image array length: ', imgarray.length)

    print('highest counter: ', imgarray.length - seq.length)

    var earliestnonzeromatch = ee.Image(999);
    for (var imageCounter = 0; imageCounter <= imgarray.length - seq.length; imageCounter++) {

        //    print("imageCounter", imageCounter) 
        var sum = ee.Image(0);
        for (var seqIndex = 0; seqIndex < seq.length; seqIndex++) {
            //print("seqIndex", seqIndex, 'value: ', seq[seqIndex])
            var tt = imgarray[imageCounter + seqIndex].eq(seq[seqIndex]);
            sum = sum.add(tt)
        }
        // Map.addLayer(ee.Image(sum), {
        //     palette: NLCDPalette_impClasses
        //     , min: minposteriors
        //     , max: 29
        // }, "sum at day " + imageCounter, false);

        var onedaymatch = sum.eq(seq.length).multiply(imageCounter + seq.length - 1)
        matchDailyStack = matchDailyStack.addBands(onedaymatch);
        // (imageCounter + seq.length - 1) puts the date of the last match in the layer.
        // having a value 16 for a sequence of size 3 means that we matched 14, 15, and 16.  having 16 here means that
        // we can the look for other sequences (eg turning into developed) starting in 16+1 = 17 and onward. 
        //Map.addLayer(matchDailyStack.select(imageCounter).randomVisualizer(), {}, "yes no match starting at day " + imageCounter, false);
        earliestnonzeromatch = afn_getsmallernonzeronumber(earliestnonzeromatch, onedaymatch)
    }
    print(matchDailyStack)
    print("printed match day image bands")

    // Map.addLayer(ee.Image(matchDailyStack[3]), {
    //     palette: NLCDPalette_impClasses
    //     , min: minposteriors
    //     , max: 29
    // }, "match date arr", false);

    // Map.addLayer(posteriorCollection, {
    //     palette: NLCDPalette_impClasses
    //     , min: minposteriors
    //     , max: 29
    // }, "collection", false);

    // Map.addLayer(ee.Image(state),
    //       {palette: NLCDPalette_impClasses, min: minposteriors, max: 29}, "state");

    // Map.addLayer(ee.Image(seqmatchdate),
    //       {palette: NLCDPalette_impClasses, min: minposteriors, max: 29}, "date");

    //  var matchImgCol = ee.ImageCollection.fromImages(matchDailyStack)
    var minimummatch = matchDailyStack.reduce(ee.Reducer.min());


    // Map.addLayer(ee.Image(earliestmatch).randomVisualizer(), {}, "Earliest match in sequence " + imageCounter, false);
    var latestmatch = matchDailyStack.reduce(ee.Reducer.max());



    //   Map.addLayer(ee.Image(earliestnonzeromatch).randomVisualizer(), {}, "Earliest match in sequence " );
    print(latestmatch)
    return ({
        'matchDailyStack': matchDailyStack // a layer of 8s in the 8th band, for all pixels that matched the sequence in question on day 8.
            //     , 'matchCollection': matchImgCol
        , 'earliestmatch': earliestnonzeromatch
        , 'latestmatch': latestmatch // produced from the matchDailyStack stack, by finding the latest date that was matched.
    })
}

function afn_findFirstAndLastMatches(imgarray, sequenceList) {

    var latestsubsequencematch = ee.Image(0); // holds the results across the sequence

    var alldailystacks = ee.Image(0)
    var theearliestmatchacrosssequences = ee.Image(999)

    for (var x = 0; x < sequenceList.length; x++) { // for each of the subsequences
        var getsequence = afn_matchASingleSequence(imgarray, sequenceList[x])
            //print(getsequence.stateArr)
        var onesequencestack = getsequence.matchDailyStack // one multiband image of match dates
        alldailystacks = alldailystacks.max(onesequencestack)
            //    var onesequencedates = ee.ImageCollection(getsequence.matchDailyStack)
            //getsequence.matchImgCol
            //    print(onesequencedates)
        var theearliestmatchinasubsequence = getsequence.earliestmatch
        print(theearliestmatchinasubsequence)
        theearliestmatchacrosssequences = afn_getsmallernonzeronumber(theearliestmatchacrosssequences, theearliestmatchinasubsequence)
        var thelatestmatch = getsequence.latestmatch
            //    var theearly = theearliestmatch
            //      Map.addLayer(ee.Image(theearly).randomVisualizer(), {}, "earliest nonzero match for subsequence " + x, false);
            //    var thelate = thelatestmatch
            //      Map.addLayer(ee.Image(thelate).randomVisualizer(), {}, "latest nonzero match for subsequence " + x, false);


        var latestsubsequencematch = latestsubsequencematch.max(thelatestmatch); // holds the results across the sequence
        //Map.addLayer(ee.Image(latestsubsequencematch).randomVisualizer(), {}, "all matches" );


        print("ok")
    }
    var thelatestmatchacrosssequences = alldailystacks.reduce(ee.Reducer.max());
    var theSequenceMatchTF = ee.Image(thelatestmatchacrosssequences).neq(0)
        ////sets all matches not equal to 0 as 1

    // Map.addLayer(ee.Image(thelatestmatchacrosssequences), {
    //     palette: rainbow_Palette
    //     , min: 0
    //     , max: 28
    // }, "Latest sequence match", true);
    // Map.addLayer(theearliestmatchacrosssequences, {
    //     palette: rainbow_Palette
    //     , min: 0
    //     , max: 28
    // }, "Earliest sequence match", true);
    // Map.addLayer(theSequenceMatchTF, {
    //     palette: gradient_Palette
    //     , min: 0
    //     , max: 29
    // }, "Sequence Match TF", true)
    // print(theSequenceMatchTF)



    return ({
        'theSequenceMatchTF': theSequenceMatchTF
        , 'theearliestmatchacrosssequences': theearliestmatchacrosssequences
        , 'thelatestmatchacrosssequences': thelatestmatchacrosssequences 
        ,'alldailystacks' : alldailystacks// 
    })

} // end of the function matching any set of sequences.


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MAIN CODE is below
/////////////////////////////////////////////////
/////////////////////////////////////////////////

var outputname = 'Sequencer_'+ purposeofsequencer +'_'+sensorused +'_' +yearscovered+'_'+whichDigitofSequences

// var stack1 = [];
// var stack2 = [];
// var stack3 = [];
// var stack4 = [];

// var numberOfBands1  = images.bandNames().length().getInfo() 
// var numberOfBands2  = images2.bandNames().length().getInfo()
// var numberOfBands3  = images3.bandNames().length().getInfo()
// var numberOfBands4  = images4.bandNames().length().getInfo()

// print ("number of bands first image: " +numberOfBands1)
// print ("number of bands second image: " +numberOfBands2)
// print ("number of bands third image: " +numberOfBands3)
// print ("number of bands third image: " +numberOfBands4)

// for(var i = 0; i <numberOfBands1; i++ ) {
//   stack1[i] = images.select(i)
// }

// for(var i = 0; i <numberOfBands2; i++ ) {
//   stack2[i] = images2.select(i)
// }
// for(var i = 0; i <numberOfBands3; i++ ) {
//   stack3[i] = images3.select(i)
// }

// for(var i = 0; i <numberOfBands4; i++ ) {
//   stack4[i] = images4.select(i)
// }

// var temp = stack1.concat(stack2);
// var temp2 = temp.concat(stack3);
// var imgarray = temp2.concat(stack4);

var aSequenceMatchObject = afn_findFirstAndLastMatches(imgarray, FirstSequencesArray)
var firstSequenceMatchTF = aSequenceMatchObject.theSequenceMatchTF
var multibandedalldailystacksfirstsequence = aSequenceMatchObject.alldailystacks
var multibandedalldailystacksfirstsequence = multibandedalldailystacksfirstsequence.toDouble()

// Export.image(multibandedalldailystacksfirstsequence, 'multibandedalldailystacksfirstsequence', {
//         'scale': 30
//         , region: geometrytouse
//     });


Export.image.toAsset({
            image: multibandedalldailystacksfirstsequence.clip(geometrytouse)
            , description: '1_multibandedalldailystacksfirstsequence_'+outputname
            , assetId: 'users/alemlakes/BULC/2500/' + outputfolderingoogledocs + '/' +'1_multibandedalldailystacksfirstsequence_'+ outputname 
            , scale: 30
            , region: geometrytouse
            , maxPixels:1e11
        }); //output image


var firstSequenceEarliestMatch = aSequenceMatchObject.theearliestmatchacrosssequences
var firstSequenceLatestMatch = aSequenceMatchObject.thelatestmatchacrosssequences
    // draw them to see how they look
Map.addLayer(ee.Image(firstSequenceLatestMatch.clip(geometrytouse)), {
    palette: rainbow_Palette
    , min: 0
    , max: 28
}, "Latest first-sequence matches outside func", true);
Map.addLayer(firstSequenceEarliestMatch.clip(geometrytouse), {
    palette: rainbow_Palette
    , min: 0
    , max: 28
}, "Earliest first-sequence matches outside func", true);
Map.addLayer(firstSequenceMatchTF, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "first Sequence Match TF outside func", true)
print(firstSequenceMatchTF)

print('done with execution of first sequencing script')

// Export.image(firstSequenceLatestMatch, 'firstSequenceLatestMatch', {
//         'scale': 30
//         , region: geometrytouse
//     });

Export.image.toAsset({
            image: firstSequenceLatestMatch
            , description: '2_firstSequenceLatestMatch_'+outputname
            , assetId: 'users/alemlakes/BULC/2500/' + outputfolderingoogledocs + '/' +'2_firstSequenceLatestMatch_'+ outputname 
            , scale: 30
            , region: geometrytouse
            , maxPixels:1e11
        }); //output image

Export.image.toDrive(
            firstSequenceLatestMatch
            ,'2_firstSequenceLatestMatch_'+outputname
            ,'3.Puget', null,null
            ,geometrytouse
            ,30
            ,null,null
            ,1e11
            ,null,null
        ); //output image


/////////////////////Creating Sequence-one Mask////////////////////////

var aSequenceMatchObject = afn_findFirstAndLastMatches(imgarray, secondSequencesArray)
var secondSequenceMatchTF = aSequenceMatchObject.theSequenceMatchTF
var secondSequenceEarliestMatch = aSequenceMatchObject.theearliestmatchacrosssequences
var secondSequenceLatestMatch = aSequenceMatchObject.thelatestmatchacrosssequences
    // draw them to see how they look
Map.addLayer(ee.Image(secondSequenceLatestMatch), {
    palette: rainbow_Palette
    , min: 0
    , max: 28
}, "Latest second-sequence matches outside func", false);
Map.addLayer(secondSequenceEarliestMatch, {
    palette: rainbow_Palette
    , min: 0
    , max: 28
}, "Earliest second-sequence matches outside func", false);
Map.addLayer(secondSequenceMatchTF, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "second Sequence Match TF outside func", false)
print(secondSequenceMatchTF)

print('done with execution of second sequencing script')


//////////////////////Second sequnce//////////////////////


/////////////////////Coordinating the two sequences////////////////////////



var doublemask = firstSequenceMatchTF.multiply(secondSequenceMatchTF)
Map.addLayer(doublemask, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "doublemask: where first and sec sequences both occur. Next we check the order", false)
print(doublemask)

var firstLatestvsSecondEarliestIsLater = secondSequenceEarliestMatch.subtract(firstSequenceLatestMatch).gt(0)
var firstLatestvsSecondEarliestTF = firstLatestvsSecondEarliestIsLater.multiply(doublemask)
var firstLatestvsSecondEarliestWhen = firstLatestvsSecondEarliestTF.multiply(firstSequenceLatestMatch)


Map.addLayer(firstLatestvsSecondEarliestTF, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "firstLatestvsSecondEarliestTF: where first and sec sequences both match and are timed right", false)
print(firstLatestvsSecondEarliestTF)
Map.addLayer(firstLatestvsSecondEarliestWhen, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "firstLatestvsSecondEarliestWhen: When seq 1 happened, where first and sec sequences both match and are timed right", false)



// latest match of first sequence vs latest match of second sequence:
var firstLatestvsSecondLatestIsLater = secondSequenceLatestMatch.subtract(firstSequenceLatestMatch).gt(0)
var firstLatestvsSecondLatestTF = firstLatestvsSecondLatestIsLater.multiply(doublemask)
var firstLatestvsSecondLatestWhen = firstLatestvsSecondLatestTF.multiply(firstSequenceLatestMatch)

Map.addLayer(firstLatestvsSecondLatestTF, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "firstLatestvsSecondLatestTF: where first and sec sequences both match and are timed right", false)
print(firstLatestvsSecondEarliestTF)
Map.addLayer(firstLatestvsSecondLatestWhen, {
    palette: gradient_Palette
    , min: 0
    , max: 29
}, "firstLatestvsSecondLatestWhen: When seq 1 happened, where first and sec sequences both match and are timed right", false)
print(firstLatestvsSecondEarliestWhen)


Export.image.toDrive(
            firstLatestvsSecondLatestWhen
            ,'3_firstLatestvsSecondLatestWhen_'+outputname
            ,'3.Puget', null,null
            ,geometrytouse
            ,30
            ,null,null
            ,1e11
            ,null,null
        ); //output image


// Export.image.toAsset({
//             image: firstLatestvsSecondLatestWhen
//             , description: '3_firstLatestvsSecondLatestWhen_'+outputname
//             , assetId: 'users/alemlakes/BULC/2500/' + outputfolderingoogledocs + '/' +'3_firstLatestvsSecondLatestWhen_'+ outputname 
//             , scale: 30
//             , region: geometrytouse
//             , maxPixels:1e11
//         }); //output image

// Export.image(firstLatestvsSecondLatestWhen, 'firstLatestvsSecondLatestWhen', {
//         'scale': 30
//         , region: geometrytouse
//     });



//////////////////////end of overlay of first and second sequence  //////////////////////


Map.addLayer(imgarray[imgarray.length - 1], {
    palette: Sleeter_Palette
    , min: minposteriors
    , max: maxposteriors
}, "last layer being considered", false);

Map.addLayer(imgarray[0], {
    palette: Sleeter_Palette
    , min: minposteriors
    , max: maxposteriors
}, "first layer being considered", false);



// var focalmatches = alllatestmatches.focal_mode(45, 'square', 'meters', 3)
// Map.addLayer(ee.Image(focalmatches), {
//     palette: rainbow_Palette
//     , min: 0
//     , max: 28
// }, "focal filter Latest first-sequence matches", true);

// Map.addLayer(ee.Image(alllatestmatches.gt(0)), {
//     palette: gradient_Palette
//     , min: minposteriors
//     , max: 29
// }, "all matches", true);

// Map.addLayer(imgarray[5], {
//     palette: Sleeter_Palette
//     , min: minposteriors
//     , max: maxposteriors
// }, "1990", true);
// Map.addLayer(imgarray[10], {
//     palette: Sleeter_Palette
//     , min: minposteriors
//     , max: maxposteriors
// }, "1995", true);
// Map.addLayer(imgarray[15], {
//     palette: Sleeter_Palette
//     , min: minposteriors
//     , max: maxposteriors
// }, "2000", true);
// Map.addLayer(imgarray[20], {
//     palette: Sleeter_Palette
//     , min: minposteriors
//     , max: maxposteriors
// }, "2005", true);
// Map.addLayer(imgarray[25], {
//     palette: Sleeter_Palette
//     , min: minposteriors
//     , max: maxposteriors
// }, "2010", true);


function afn_combineBurn(image1, image2) {
  // burns image1 on top of image2
  var negmaskimg = image1.not();
  var newmask = negmaskimg.multiply(image2);
  newmask = newmask.add(image1);
  return newmask;
}

