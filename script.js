    let chartInstance = null; // For tracking the chart instance

    function calculateEMI() {
      const loanAmount = parseFloat(document.getElementById("loanAmount").value);
      const annualRate = parseFloat(document.getElementById("interestRate").value);
      const tenure = parseInt(document.getElementById("tenure").value);

      if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(annualRate) || annualRate <= 0 || isNaN(tenure) || tenure <= 0) {
        alert("Please enter valid positive values for all fields.");
        return;
      }

      const monthlyRate = annualRate / 12 / 100;
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);
        
         const totalPayable = emi * tenure;

      document.getElementById("emiResult").innerText = `Monthly EMI: ₹${emi.toFixed(2)}`;
      document.getElementById("emiResult").style.display = "block";

      document.getElementById("loanAmountDisplay").innerText = loanAmount.toFixed(2);
      document.getElementById("interestRateDisplay").innerText = annualRate.toFixed(2);
      document.getElementById("tenureDisplay").innerText = tenure;
	  document.getElementById("totalPayableDisplay").innerText = totalPayable.toFixed(2);
      document.getElementById("details").style.display = "block";
      document.getElementById("printButton").style.display = "block";

      generatePaymentScheduleAndChart(loanAmount, emi, monthlyRate, tenure);
    }

    function generatePaymentScheduleAndChart(loanAmount, emi, monthlyRate, tenure) {
      const tableBody = document.querySelector("#paymentSchedule tbody");
      tableBody.innerHTML = "";
      let balance = loanAmount;

      const principalData = [];
      const interestData = [];
      const labels = [];

      for (let month = 1; month <= tenure; month++) {
        const interest = balance * monthlyRate;
        const principal = emi - interest;
        balance -= principal;

        principalData.push(principal.toFixed(2));
        interestData.push(interest.toFixed(2));
        labels.push(`Month ${month}`);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${month}</td>
          <td>₹${principal.toFixed(2)}</td>
          <td>₹${interest.toFixed(2)}</td>
          <td>₹${balance > 0 ? balance.toFixed(2) : 0.00}</td>
        `;
        tableBody.appendChild(row);
      }

      document.getElementById("paymentSchedule").style.display = "table";
      drawChart(labels, principalData, interestData);
    }

    function drawChart(labels, principalData, interestData) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById("emiChart").getContext("2d");
      document.getElementById("emiChart").style.display = "block";

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Principal Payment',
              data: principalData,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Interest Payment',
              data: interestData,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
