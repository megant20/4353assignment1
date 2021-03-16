var regressionTestData = [
	{ gallonsRequested: 30469, totalDue: 74448.062 },
	{ gallonsRequested: 44181, totalDue: 103892.482 },
	{ gallonsRequested: 12682, totalDue: 29182.213 },
	{ gallonsRequested: 42799, totalDue: 102631.187 },
	{ gallonsRequested: 39176, totalDue: 91639.093 },
	{ gallonsRequested: 36670, totalDue: 77668.837 },
	{ gallonsRequested: 46748, totalDue: 101367.251 },
	{ gallonsRequested: 16770, totalDue: 38199.232 },
	{ gallonsRequested: 23451, totalDue: 50389.757 },
	{ gallonsRequested: 33122, totalDue: 75339.943 },
	{ gallonsRequested: 40831, totalDue: 88737.627 },
	{ gallonsRequested: 49495, totalDue: 117597.165 },
	{ gallonsRequested: 44201, totalDue: 110043.907 },
	{ gallonsRequested: 14921, totalDue: 37287.139 },
	{ gallonsRequested: 11455, totalDue: 25978.443 },
	{ gallonsRequested: 30384, totalDue: 73744.797 },
	{ gallonsRequested: 33074, totalDue: 70377.379 },
	{ gallonsRequested: 26341, totalDue: 65785.586 },
	{ gallonsRequested: 18004, totalDue: 41980.606 },
	{ gallonsRequested: 14713, totalDue: 31977.914 },
	{ gallonsRequested: 15746, totalDue: 39250.294 },
	{ gallonsRequested: 14004, totalDue: 30933.329 },
	{ gallonsRequested: 23164, totalDue: 50825.111 },
	{ gallonsRequested: 10619, totalDue: 24755.401 },
	{ gallonsRequested: 19726, totalDue: 44555.01 },
	{ gallonsRequested: 10535, totalDue: 22204.657 },
	{ gallonsRequested: 24066, totalDue: 60017.885 },
	{ gallonsRequested: 46945, totalDue: 104593.872 },
	{ gallonsRequested: 22964, totalDue: 52856.803 }
];

//	expected outputs (calculated in Excel, 0.1% tolerance):
//		-310.72041 <= a <= -310.09959
//		2.3184792 <= b <= 2.3231208
//	nomenclature:
//		a : intercept
//		b : slope