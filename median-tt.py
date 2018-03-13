    # 2646 - Averaging truth tables

# path/row: 46027

# Import the Earth Engine Python Package

import os
import sys
import datetime
import subprocess
import os,time
import csv
import imp
import numpy
import config
import ee

# Initialize the Earth Engine object, using the authentication credentials.
ee.Initialize()

purgetareatemp = [ 
            [-124.30352972536059, 47.27128166063033]
            , [-123.82925991252449, 46.99729412374967]
            , [-123.41252757794297, 47.01561045135977]
            , [-123.05027483485514, 46.771956019864334]
            , [-122.44190923893768, 46.763439270315246]
            , [-121.94897256625057, 47.22100723424152]
            , [-121.77901836750891, 47.487138539754966]
            , [-121.75131153567213, 47.88025613902951]
            , [-121.73334011579027, 48.24438682613085]
            , [-121.97477014374817, 48.47585180754761]
            , [-121.8872009786362, 48.63440708876777]
            , [-122.08018971228478, 48.68415986506167]
            , [-122.16362767200712, 48.748252827165615]
            , [-122.1335388193238, 48.90459170207551]
            , [-122.09164888171688, 49.00874288419323]
            , [-123.31699205680519, 49.0073000568708]
            , [-122.99423732371145, 48.83336138137028]
            , [-122.97028555875431, 48.77562055398919]
            , [-123.25352154725601, 48.696430820418186]
            , [-123.14524526931791, 48.377222174739494]
            , [-122.85605336746943, 48.34034389530577]
            , [-122.96268407568925, 48.20110486049082]
            , [-123.86727220731296, 48.20751922706289]
            , [-124.78084798923732, 48.443982161696766]
            , [-124.69448407110332, 47.853999226102864]
            , [-124.55536931824389, 47.70043015361133]
            , [-124.48645933302026, 47.56454360734233]
        ]

purgetarea_temp = ee.Geometry.Polygon(purgetareatemp)
    

    
numberOfClasses = 9


maxPixelRequestSize = 1e10

numclassbaseimg  = numberOfClasses + 1 #number of classes in base image  + 1
numclasseventimg = numberOfClasses + 1 #number of classes in event image + 1

minclassbaseimg = 1



transitionDampeningFactor = 1 #1 = no change, lower more dampening (0 - 1)


exporttables = True;

tt_type      = "A"


firstPrefix           = "users/alemlakes/BULC/2500/2628/"
suffix                = "_2628_classification_A_filtered"
path                  = "truth_table_" + tt_type;



#print(imagesData[1])
imagesName = [
      'LT50450281985132PAC00'
    , 'LT50450281985196PAC08'
    , 'LT50450281985228PAC09'
    , 'LT50450281986199XXX21'
    , 'LT50450281993314XXX02' # example data set
    , 'LT50450281994269XXX02'
    , 'LT50450281995176XXX01'
    , 'LT50450281995256XXX02'
    , 'LT50450281995288XXX00'
    , 'LT50450281995304AAA01'
    , 'LT50450281996147XXX02'
]


imagesData = []
imagesURL  = []


if not os.path.exists(path): #checking if folder doesn't exist
        os.makedirs(path) # make folder

for names in imagesName: 

    filename      = names + ".done"
    make_file     = names + ".notdone"
    imagesData.append(ee.Image(firstPrefix+names+suffix))
    imagesURL.append(firstPrefix+names+suffix)
    if os.path.isfile(str(path+"/"+filename))==False:
        print("creating .notdone because .done doesn't exist", names)
        #os.remove(str(path+"/"+filename))
        file_done = open(str(path+"/"+make_file), 'w');
        file_done.write(names);
        file_done.close()
    new_path = names+"/"+"TransitionTable"+tt_type
    if not os.path.exists(new_path): #checking if image name folder doesn't exist
        os.makedirs(str(names+"/"+"TransitionTable"+tt_type)) # make folder

        


################################################################################## 
############################ logic start #########################################
################################################################################## 
def afn_histogram(firstimg, secimg, purgetarea_temp, maxPixelRequestSize, numclassbaseimg, numclasseventimg, minclassbaseimg):

    xlist = [];
    sublist = [];


    # Create initial list of list
    for i in range(0, numclassbaseimg):
        sublist = [];

        for j in range(0, numclassbaseimg):
            sublist.append(0)
        xlist.append(sublist);
    
    #1000(column) + (row) to calculate confusion table
    img2 = firstimg.addBands(firstimg); #combine bands for caluclations
    img2 = img2.multiply(1000); #multiply image by 1000
    img = secimg.add(img2); #add bands together

      
    # ---NEW METHOD BEGIN---- 

    geom1 = firstimg.geometry()
    geom2 = secimg.geometry()

    intersection_polygon = ee.Algorithms.If(geom2.intersects(geom1), geom2.intersection(geom1), purgetarea_temp); # faster, in theory
    intersection_polygon = ee.Geometry(intersection_polygon).buffer(30)


    pixelcount = img.mask(127).reduceRegion( reducer=ee.Reducer.count().group(0),geometry=intersection_polygon,maxPixels=maxPixelRequestSize).values().getInfo()[0]

    # For the each group find the row and column
    for i in range(0, len(pixelcount)):
        row = pixelcount[i]['group']% 1000; # calculate the row by getting the remainder of the group # divided by 1000
        column = (pixelcount[i]['group'] - row) / 1000; # calculate column by subtracting the row and dividing by 1000
        # plug in count into specific row and column in blank list of list
        if (row >= 0 and column >= 0 and row < numclasseventimg and column < numclassbaseimg ): # make sure size of confusion table same as numclassbaseimg X numclasseventimg
            xlist[column][row] = pixelcount[i]['count']; #plug in count at specified point
        

    totallist = [] # calculate total pixel count for calculating probabilities
    #print(len(xlist)) # 9
    for j in range(0, len(xlist)): # Calculates the totals of each class in firstimg
        count = 0; #set count to zero
        n = len(xlist[j])
        for i in range(0, n): 
            count += xlist[j][i]; #add in all number in the same class
        totallist.append(count)
    

    return {
        'histolist': xlist
        , 'total': totallist
    }


def afn_probabilitylist(histogram, total):
    confusion = [];
    confusionlist = []


    for j in range (0, len(histogram)):

        histo1 = histogram[j];
        total1 = total[j]
        if total1 == 0:
            confusionlist.append(histo1); # if no class in day i image then list = 0
        else:
            confusion = [];

            total1 = ee.Number(total1).float();

            for i in range (0, numclasseventimg): #hardcoded nonsense
                confusion.append(ee.Number(histo1[i]).divide(total1).float()); # Divide histogram value with total to get probability
            
            confusionlist.append(confusion)
        

    return (confusionlist); #output as object where "variable".img is the image created and "variable".confusion is the confusion table created


def afn_dampentransitions(thevalue):
    # tried to round the numbers to see if it is faster. doesn't seem to be.
    addvalue = ee.Number((1 - transitionDampeningFactor) / (numclasseventimg)).multiply(10000).round().divide(10000).float(); #hard coded nonsend
    thevalue = ee.Number(thevalue).float();
    thevalue = thevalue.multiply(transitionDampeningFactor);
    thevalue = thevalue.add(addvalue);
    return (thevalue);


def myTranspose(lst):
    newlist = []
    i = 0
    while i < len(lst):
        j = 0
        colvec = []
        while j < len(lst):
            colvec.append(lst[j][i])
            j = j + 1
        newlist.append(colvec)
        i = i + 1
    return newlist


def median(lst):
    return numpy.median(numpy.array(lst))

def afn_truthtable(number, maxPixelRequestSize, purgetarea_temp, firstimg, secimg, numclassbaseimg, numclasseventimg, name_first, name_second, minclassbaseimg):

    trutharray = [];
    histogram = [];
    newclassimg = [];
    classimg = [];
    undampen = [];
    problist = [];

    export_path = name_second+"/"+"TransitionTable"+tt_type+"/"



    histogram = afn_histogram(firstimg, secimg, purgetarea_temp, maxPixelRequestSize, numclassbaseimg, numclasseventimg, minclassbaseimg); #create histogram
    problist = afn_probabilitylist(histogram['histolist'], histogram['total']); #use histogram to create probability
    undampen = problist; #used to create output of undamped probabilities


    for  i in range (0, len(problist)):
        data = ee.List(problist[i])
        trutharray.append(data.map(afn_dampentransitions)); #output of dampened probabilities


    if exporttables == True:

        outputundampen = myTranspose(undampen)
        outputPixelCount = myTranspose(histogram['histolist'])
       
        totalPixel = histogram['total']



        trutharray2 = []
    
        exportUndampen = [];
        for  i in range (0, numclassbaseimg):
            innerUndampenPixels = [];
            for  j in range (0, numclassbaseimg):
            
                innerUndampenPixels.append(ee.Number(outputundampen[i][j]));
            data = ee.List(innerUndampenPixels)

            print("inner outputundampen", data.getInfo())
           

            exportUndampen.append(data.getInfo());
       

        fl = open(str(export_path + "3." + name_second + "-undampen-transition-table-" + name_first+".csv"), 'w')
        writer = csv.writer(fl)
        writer.writerow(['base:', name_second, 'against', name_first, 'label5','label6', 'label7',]) #if needed
        for values in exportUndampen:
           writer.writerow(values)
        fl.close()   
        print("writing out new undampened pixel counts CSV file")
    


        exportPixelCounts = [];
        for  i in range (0, numclassbaseimg):
            innerPixelCounts = [];
            for  j in range (0, numclassbaseimg):
                innerPixelCounts.append(ee.Number(outputPixelCount[i][j]));
            data = ee.List(innerPixelCounts)

            print("inner pixel count comparison", data.getInfo())
           
            exportPixelCounts.append(data.getInfo());


        fl = open(str(export_path +"2." +name_second + "-pixel-counts-" + name_first+".csv"), 'w')
        writer = csv.writer(fl)
        writer.writerow(['base:', name_second, 'against', name_first, 'label5','label6', 'label7',]) #if needed
        for values in exportPixelCounts:
           writer.writerow(values)
        fl.close()   
        print("writing out new comparison pixel counts CSV file")


        exportTotalPixelCounts = [];
        for data in totalPixel:
            innerTotalPixelCounts = [];
            for  j in range (0, 1):
                innerTotalPixelCounts.append(ee.Number(data));
            data = ee.List(innerTotalPixelCounts)

            print("inner total pixel counts", data.getInfo())
           
            exportTotalPixelCounts.append(data.getInfo());
        # print("testing the print of undampen pixels wooooo", exportUndampen)
        # print("one more test, seeing if it's a regular 2D array", exportUndampen[1][3])

        fl = open(str(export_path +"1."+name_second + "-total-pixel-counts-" + name_first+".csv"), 'w')
        writer = csv.writer(fl)
        writer.writerow(['label1', 'label2',]) #if needed
        for values in exportTotalPixelCounts:
           writer.writerow(values)
        fl.close()   
        print("writing out new total pixel counts CSV file")
    return trutharray;



def averageTruth(first, second, base, third, forth):

    doubled               = [];
    exportDoubles         = [];

    tt_type               = "A"
    x                     = base

    firstimg              = imagesData[first];
    secimg                = imagesData[second];
    base                  = imagesData[base];
    thirdimg              = imagesData[third];
    forthimg              = imagesData[forth];

    filename_done         = imagesName[x] + ".done"
    filename_notdone      = imagesName[x] + ".notdone"
    path                  = "truth_table_" + tt_type;
    image_name            = imagesName[x]
    

    



    if os.path.isfile(str(path+"/"+filename_done))==False: #checking if .done file doesn't exist 
       
        print("now working on image", str(imagesURL[x]))



        tt1 = afn_truthtable(7, maxPixelRequestSize, purgetarea_temp, firstimg, base, numclassbaseimg, numclasseventimg, imagesName[first], imagesName[x], minclassbaseimg); 

        tt2 = afn_truthtable(7, maxPixelRequestSize, purgetarea_temp, secimg, base,  numclassbaseimg, numclasseventimg, imagesName[second], imagesName[x], minclassbaseimg);

        tt3 = afn_truthtable(7, maxPixelRequestSize, purgetarea_temp, thirdimg, base, numclassbaseimg, numclasseventimg, imagesName[third], imagesName[x], minclassbaseimg);

        tt4 = afn_truthtable(7, maxPixelRequestSize, purgetarea_temp, forthimg, base, numclassbaseimg, numclasseventimg, imagesName[forth], imagesName[x], minclassbaseimg);

        for  i in range (0, numclassbaseimg):
            innerDouble = [];
            for  j in range (0, numclassbaseimg):
                tmp = [];
                tmp.extend([ee.Number(tt1[i].get(j)), ee.Number(tt2[i].get(j)), ee.Number(tt3[i].get(j)), ee.Number(tt4[i].get(j))])
                number = ee.List(tmp)
                proper = median(number.getInfo())
                innerDouble.append(proper)
                #innerDouble.append(ee.Number(tt1[i].get(j)).add(ee.Number(tt2[i].get(j))).add(ee.Number(tt3[i].get(j))).add(ee.Number(tt4[i].get(j))).divide(4));
            data = ee.List(innerDouble)
            data = ee.Array(data);
            data = data.divide(data.accum(0).slice(0,numclassbaseimg-1,numclassbaseimg).repeat(0,numclassbaseimg)).toList();
            print("non-transposed data", data.getInfo())
           
            exportDoubles.append(data);
            doubled.append(data.getInfo());


        trans_doubled = myTranspose(doubled)
        print("transposed data", trans_doubled)


        new_path = image_name+"/"+"TransitionTable"+tt_type + "/"
        fl = open(str(new_path+"0."+image_name+"_averages_transition_table" +".csv"), 'w')
        writer = csv.writer(fl)
        writer.writerow(['label1', 'label2', 'label3', 'label4', 'label5','label6', 'label7',]) #if needed
        for values in trans_doubled:
           writer.writerow(values)
        fl.close()   
        print("writing out median truth table CSV file")



        s = ','.join(str(item) for innerlist in trans_doubled for item in innerlist)

        spl = s.split(",") # split into list of individual items

        temp = "\n".join([",".join(spl[i:i+numclasseventimg]) for i in range(0,len(spl),numclasseventimg)])
        individualLists = temp.split('\n')
        #print("each row ",len(individualLists))

        tt_numclassbase  = "truthtable_" + tt_type + "_numclassbase" "=" + str(numclassbaseimg-1); 
        tt_numclassevent = "truthtable_" + tt_type + "_numclassevent" "=" +str(numclasseventimg-1)


        subprocess.call(['earthengine', 'asset', 'set', '-p', tt_numclassbase, str(imagesURL[x]) ])
        subprocess.call(['earthengine', 'asset', 'set', '-p', tt_numclassevent, str(imagesURL[x]) ])
        print("property data",s)
        print("gee obj",exportDoubles)


        #print("testing crash", individualLists[6])
        for t in range (0, numclasseventimg):
            print("index counter", t)
            print("each row", individualLists[t])
            eeString = "truthtable_"+  tt_type +"_" +str(t)+"="+individualLists[t]
            subprocess.call(['earthengine', 'asset', 'set', '-p', eeString, str(imagesURL[x]) ])


        # make .done file
        print("deleting .notdone file")
        os.remove(str(path+"/"+filename_notdone)) # remove .notdone file
        print("creating .done file")
        file_done = open(str(path+"/"+filename_done), 'w');
        file_done.write(names);
        file_done.close()

    

    else:
        print str(path+"/"+image_name)

size = len(imagesData)

averageTruth(1, 2, 0, 3, 4)
averageTruth(0, 2, 1, 3, 4)


for x in range (2, len(imagesData)-2):
    averageTruth(x-2, x-1, x, x+1, x+2)

averageTruth(size-4, size-3, size-2, size-1, size-5)
averageTruth(size-3, size-2, size-1, size-4, size-5)

print 'All done with one tile.'