FROM="$1"
TO="$2"

for i in $TO/*
do
	ext=${i##*.}
	FROMF=`echo $FROM/*$ext`
	TOF=`echo $TO/*$ext`
	cp $FROMF $TOF
	echo cp $FROMF $TOF
done

