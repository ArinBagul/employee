// #include<iostream>
// using namespace std;
// int main()
// {
//     int num1;
//     int num2;
//     cin>>num1;
//     cin>>num2;
//     int result;
//     result = num1 + num2;
//     cout<<num1<<" + "<<num2<<" = "<<result;
//     return 0;
// }



#include <iostream>
using namespace std;

int main()
{
	int N;
    cin>>N;

	int spaces = 2 * N - 1;
	int stars = 0;

	for (int i = 1; i <= 2 * N+1; i++) {
		// Upper half of the butterfly
		if (i <= N) {
			spaces = spaces - 2;
			stars++;
		}
		// Lower half of the butterfly
		else {
			spaces = spaces + 2;
			stars--;
		}
		// Print stars
		for (int j = 1; j <= stars; j++) {
			cout << "*";
		}
		// Print spaces
		for (int j = 1; j <= spaces; j++) {
			cout << " ";
		}
		// Print stars
		for (int j = 1; j <= stars; j++) {
			if (j != N) {
				cout << "*";
			}
		}
		cout << "\n";
	}

	return 0;
}
