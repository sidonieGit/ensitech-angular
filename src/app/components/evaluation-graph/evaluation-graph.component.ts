
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-evaluation-graph',
  templateUrl: './evaluation-graph.component.html',
  styleUrls: ['./evaluation-graph.component.css']
})
export class EvaluationGraphComponent implements OnChanges {
  @Input() specialities: any[] = [];
  @Input() evaluations: any[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'étudiants'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Spécialités'
        }
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Étudiants avec moyenne ≥ 10',
      }
    ]
  };

  /*ngOnInit() {
    this.processData();
    console.log('Bar Chart Data:', this.specialities);
  }*/
  //  Se déclenche à chaque fois que Input() change
  ngOnChanges(changes: SimpleChanges) {
    console.log('out', this.specialities);
    this.processData();
    /*if (
      (changes['specialities'] && this.specialities?.length > 0) &&
      (changes['evaluations'] && this.evaluations?.length > 0)
    ) {
      console.log('Bar Chart Data:', this.specialities);
      this.processData();
    }*/
  }

  processData() {
    // Crée deux tableaux vides : 
    // 'labels' contiendra les noms des spécialités pour l'axe X du graphique
    // 'counts' contiendra le nombre d'étudiants avec moyenne >= 10 pour chaque spécialité
    const labels: string[] = [];
    const counts: number[] = [];

    // On parcourt toutes les spécialités
    this.specialities.forEach(spec => {
      // On récupère les IDs des cours de cette spécialité
      const courseIds = spec.courses.map((c: any) => c.id);

      // On filtre les évaluations pour ne garder que celles qui appartiennent aux cours de cette spécialité
      const evalsForSpec = this.evaluations.filter(
        (ev: any) => courseIds.includes(ev.course.id)
      );

      // On va regrouper les notes par étudiant
      // studentGrades est un objet où la clé = studentId et la valeur = tableau de notes
      const studentGrades: { [studentId: number]: number[] } = {};

      // On parcourt toutes les évaluations de la spécialité
      evalsForSpec.forEach((e: any) => {
        // Si l'étudiant n'a pas encore de tableau de notes, on le crée
        if (!studentGrades[e.studentId]) {
          studentGrades[e.studentId] = [];
        }
        // On ajoute la note de cette évaluation au tableau de l'étudiant
        studentGrades[e.studentId].push(e.grade);
      });

      // On compte maintenant les étudiants ayant une moyenne >= 10
      let validCount = 0;

      // On parcourt les tableaux de notes de chaque étudiant
      Object.values(studentGrades).forEach(grades => {
        // Calcul de la moyenne simple : somme des notes / nombre de notes
        const avg = grades.reduce((a, b) => a + b, 0) / grades.length;

        // Si la moyenne est >= 10, on incrémente le compteur
        if (avg >= 10) validCount++;
      });

      // On ajoute le nom de la spécialité dans labels pour l'axe X
      labels.push(spec.label);

      // On ajoute le nombre d'étudiants valides dans counts pour l'axe Y
      counts.push(validCount);
    });

    // On construit maintenant l'objet barChartData pour Chart.js
    // labels = noms des spécialités
    // datasets[0].data = nombre d'étudiants ayant >= 10 pour chaque spécialité
    this.barChartData = {
      labels,
      datasets: [
        {
          data: counts,
          label: 'Étudiants avec moyenne ≥ 10 par spécialité',
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }

}
